var pdfContent = "";
var canvas = document.getElementById("the-canvas");
 var context = canvas.getContext('2d');
    // canvas.height = viewport.height;
    // canvas.width = viewport.width;

var data =  "file:///android_asset/www/pdf/orientation.pdf";
PDFJS.getDocument(data).then(function (doc) {
  var numPages = doc.numPages;
  console.log('# Document Loaded');
  console.log('Number of Pages: ' + numPages);
  console.log();

  var lastPromise; // will be used to chain promises
  lastPromise = doc.getMetadata().then(function (data) {
    console.log('# Metadata Is Loaded');
    console.log('## Info');
    console.log(JSON.stringify(data.info, null, 2));
    console.log();
    if (data.metadata) {
      console.log('## Metadata');
      console.log(JSON.stringify(data.metadata.metadata, null, 2));
      console.log();
    }
  });

  var loadPage = function (pageNum) {
    return doc.getPage(pageNum).then(function (page) {
      console.log('# Page ' + pageNum);
      var viewport = page.getViewport(1.0 /* scale */);
      console.log('Size: ' + viewport.width + 'x' + viewport.height);
      console.log();
      return page.getTextContent().then(function (content) {        
        // Content contains lots of information about the text layout and
        // styles, but we need only strings at the moment
        var strings = content.items.map(function (item) {                    
          return item.str;
        });
        console.log('## Text Content');
        console.log(strings.join(' '));
        pdfContent = strings.join('');
        
      }).then(function () {
        console.log();
      });
      var renderContext = {
        canvasContext: pdfContent,
        viewport: viewport
      };
      page.render(renderContext);      
    })
  };
  // Loading of the first page will wait on metadata and subsequent loadings
  // will wait on the previous pages.
  for (var i = 1; i <= numPages; i++) {
    lastPromise = lastPromise.then(loadPage.bind(null, i));
  }
  return lastPromise;
}).then(function () {
  console.log('# End of Document');
}, function (err) {
  console.error('Error: ' + err);
});