<?php

use PhpParser\Node;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use PhpParser\NodeVisitorAbstract;
use PhpParser\ParserFactory;

if ( $argc < 1 ) {
	printf( "Usage: php {$argv[0]} <dir_to_scan>\n" );
	exit( 1 );
}

// The directory to scan is the first argument.
$directory = $argv[1];

if ( ! is_dir( $directory ) ) {
	printf( "The path %s is not a valid directory\n", $directory );
	exit( 1 );
}

// Create a list of all the PHP files in the directory, recursively.
$files = new CallbackFilterIterator(
	new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $directory ),
		RecursiveIteratorIterator::SELF_FIRST,
		FilesystemIterator::SKIP_DOTS
	), function ( SplFileInfo $file ) {
	return str_ends_with( $file->getFilename(), '.php' );
} );

require_once __DIR__ . '/vendor/autoload.php';

// Use nikic/php-parser to scan each file for calls to the `tec_asset` function and print file and line to the terminal in file:line format.
$traverser = new NodeTraverser();
$visitor   = new class( $directory ) extends NodeVisitorAbstract {
	private ?SplFileInfo $currentFile = null;
	/**
	 * @var array<string,array{jsAssetFile: string, file: string, line: int}>
	 */
	private array $unregisteredCssAsset = [];
	/**
	 * @var array<string,true>
	 */
	private array $registeredAssets = [];
	/**
	 * @var string
	 */
	private string $directory;

	/**
	 * @param string $directory The directory being scanned.
	 */
	public function __construct( string $directory ) {
		$this->directory = $directory;
	}

	public function setCurrentFile( SplFileInfo $file ) {
		$this->currentFile = $file;
	}

	/**
	 * @return array<string,true>
	 */
	public function getRegisteredAssets(): array {
		return $this->registeredAssets;
	}

	public function enterNode( Node $node ) {
		if ( $node instanceof FuncCall ) {
			if ( ! ( isset( $node->name )
			         && $node->name instanceof Node\Name
			         && in_array( $node->name->__toString(), [ 'tec_asset', 'tec_assets' ], true ) ) ) {
				// Not a function call we're looking for.
				return $node;
			}

			if ( $node->name->__toString() === 'tec_asset' ) {
				return $this->checkAssetCall( $node );
			}

			// The called function is the `tec assets` one.
			return $this->checkAssetsCall( $node );
		}

		if ( $node instanceof Node\Expr\StaticCall ) {
			$className  = $node->class->name;
			$methodName = $node->name->toString();

			if (
				$methodName === 'add'
				&& isset( $node->args[1]->value )
				&& $node->args[1]->value instanceof Node\Scalar\String_
				&& in_array( $className, [
					'TEC\Common\StellarWP\Assets\Asset',
					'TEC\Common\Asset'
				], true )
			) {
				$path = $node->args[1]->value->value;
				$this->checkAsset( $path, $node->getLine() );
			}

			return $node;
		}
	}

	private function checkAsset( string $path, int $line ): void {
		// Ignore externals.
		if ( str_starts_with( $path, 'http://' ) || str_starts_with( $path, 'https://' ) ) {
			return;
		}

		if ( ! preg_match(
			'#(?P<path>.*)(\.js|\.css)$#',
			$path,
			$match
		) ) {
			return;
		}

		$extension = substr( $match[2], 1 );

		if (
			str_starts_with( $match[0], 'vendor' )
			|| str_starts_with( $match[0], 'node_modules' )
			|| str_starts_with( $match[0], 'common/node_modules' )
		) {
			// Assets loaded from vendor or node_modules don't need to be in ./build, but we still need to make sure they're not missing.
			$assetFile = '/' . $match[0];
			// These files might come only in minified version.
			$minifiedAssetFile           = preg_replace( '/\.(js|css)$/', '.min$0', $assetFile );
			$buildAssetFile              = '/build' . $assetFile;
			$buildMinifiedAssetFile      = '/build' . $minifiedAssetFile;
			$assetFileRealpathCandidates = [
				$assetFile,
				$minifiedAssetFile,
				$buildAssetFile,
				$buildMinifiedAssetFile
			];
			$survivingCandidates         = array_filter(
				$assetFileRealpathCandidates,
				fn( string $candidate ): bool => is_file( $this->directory . $candidate )
			);
			$assetFile                   = count( $survivingCandidates ) ? reset( $survivingCandidates ) : $assetFile;
		} else if ( str_starts_with( $match[0], 'app' ) ) {
			/*
			 * The `app` name is tricky: it might be a package built in the `/build` directory or an asset just named
			 * something like `app-shop.js`.
			 */
			$extensionFragments  = explode( '.', $match[2] );
			$extension           = end( $extensionFragments );
			$candidates          = [
				'/build/' . $match[0], // The app built in `/build`.
				"/build/$extension/$match[0]" // An asset called `app-something.js`.
			];
			$survivingCandidates = array_filter(
				$candidates,
				fn( string $candidate ): bool => is_file( $this->directory . $candidate )
			);
			$assetFile           = count( $survivingCandidates ) ? reset( $survivingCandidates ) : '/build/' . $match[0];
		} else {
			$candidates          = [
				'/build/' . $match[0], // The app built in `/build`.
				"/build/$extension/$match[0]" // An asset called `app-something.js`.
			];
			$survivingCandidates = array_filter(
				$candidates,
				fn( string $candidate ): bool => is_file( $this->directory . $candidate )
			);
			$assetFile = count( $survivingCandidates ) ? reset( $survivingCandidates ) : '/build/' . $match[0];
		}

		$assetFileRealpath = $this->directory . $assetFile;

		if ( ! is_file( $assetFileRealpath ) ) {
			printf(
				"Error at %s:%d\n└── Asset %s doesn't exist.\n",
				$this->currentFile->getRealPath(),
				$line,
				'.' . $assetFile
			);
		}

		if ( $extension === 'js' ) {
			// If the file is a .js file, check if a `style-<asset>.css` file exists: if it exists, collect it for later checking.
			$basename = basename( $match[0] );
			$cssFile  = str_replace( $basename, 'style-' . substr( $basename, 0, - 3 ) . '.css', $assetFile );
			if ( is_file( $this->directory . $cssFile ) ) {
				// There is a style file: make sure it's registered along with the JS asset.
				$this->unregisteredCssAsset[ $cssFile ] = [
					'jsAssetFile' => $assetFile,
					'file'        => $this->currentFile->getRealPath(),
					'line'        => $line
				];
			}
		} else {
			// The file is a CSS file: remove it from the unregistered CSS assets list.
			unset( $this->unregisteredCssAsset[ $assetFile ] );
		}
		$this->registeredAssets[ $assetFile ] = true;
	}

	/**
	 * Return an array of unregistered CSS assets.
	 *
	 * @since TBD
	 *
	 * @return array<string,array{jsAssetFile: string, file: string, line: int}>
	 */
	public function getUnregisteredCssAssets(): array {
		return $this->unregisteredCssAsset;
	}

	private function checkAssetsCall( FuncCall $node ): Node {
		// The second argument will be an array of assets. Each asset is an array whose second argument is the asset path.
		if ( ! ( isset( $node->args[1] )
		         && $node->args[1]->value instanceof Node\Expr\Array_ ) ) {
			return $node;
		}

		/** @var Node\ArrayItem $asset */
		foreach ( $node->args[1]->value->items as $asset ) {
			/** @var string $path */
			$path = $asset->value->items[1]->value->value;
			if ( ! preg_match(
				'#(?P<path>.*)(\.js|\.css)$#',
				$path,
				$match
			) ) {
				continue;
			}

			$this->checkAsset( $path, $node->getLine() );
		}

		return $node;
	}

	private function checkAssetCall( FuncCall $node ): Node {
		// The third argument is the asset path; if it's a .js or .css file, make sure it exists in relation to ./build.
		if ( isset( $node->args[2] ) && $node->args[2]->value instanceof Node\Scalar\String_ ) {
			$this->checkAsset( $node->args[2]->value->value, $node->getLine() );
		}

		return $node;
	}
};
$traverser->addVisitor( new NameResolver() );
$traverser->addVisitor( $visitor );
$parser = ( new ParserFactory )->createForNewestSupportedVersion();

/** @var SplFileInfo $file */
foreach ( $files as $file ) {
	$code = file_get_contents( $file->getPathname() );
	$ast  = $parser->parse( $code );
	$visitor->setCurrentFile( $file );
	$traverser->traverse( $ast );
}

$registeredAssets = $visitor->getRegisteredAssets();
foreach ( $visitor->getUnregisteredCssAssets() as $cssFile => $cssFileData ) {
	if ( isset( $registeredAssets[ $cssFile ] ) ) {
		continue;
	}

	printf(
		"Warning at %s:%d\n└── JS Asset %s is registered, but CSS asset %s is not.\n",
		$cssFileData['file'],
		$cssFileData['line'],
		$cssFileData['jsAssetFile'],
		$directory . $cssFile
	);
}
