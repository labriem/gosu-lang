package gw.gosudoc.util

uses gw.gosudoc.GSDocHTMLWriter
uses org.junit.BeforeClass

uses java.io.File
uses java.nio.file.Files

class BaseGosuDocTest {

  static var _OUT_DIR : File = null

  @BeforeClass
  static function initGosuDoc() {
    if(_OUT_DIR == null) {
      using ( BaseGosuDocTest as IMonitorLock) {
        if(_OUT_DIR == null){
          _OUT_DIR = genGosuDocForTests()
        }
      }
    }
  }


  /* ----------------------------------------------------------------------------
   * Init logic: generate GosuDoc for all classes in the com/example package
   * ---------------------------------------------------------------------------- */
  private static function genGosuDocForTests() : File {

    var outfile = Files.createTempDirectory( null, {} ).toFile()

    var htmlGenerator = new GSDocHTMLWriter() {
      :Output = outfile,
      :InputDirs = {new File('src/test/gosu')},
      :Verbose = true
    }

    htmlGenerator.write()

    return outfile
  }

  /* ----------------------------------------------------------------------------
   * Test Helpers
   * ---------------------------------------------------------------------------- */
  function gosuDocForType( example: Type ): File {
    return gosuDocForString( example.Name, example.Namespace )
  }

  function gosuDocForString( name: String, pkg : String = null ): File {
    if(pkg == null) {
      pkg = name.substring( name.lastIndexOf( '.' ) )
    }
    var fileName = pkg.split( "\\." ).join( File.separator ) + File.separator + name + ".html"
    var file = new File(_OUT_DIR, fileName )
    if(file.exists()) {
      return file
    } else {
      return null
    }
  }

}
