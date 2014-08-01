define({

  // RequireJS config object
  requirejs: {
    paths: {
      jquery: ['vendor/jquery-2.1.1.min'],
      slider: ['vendor/jquery.nouislider.min'],
      magnific: ['vendor/jquery.magnific-popup.min'],
      fastclick: ['vendor/fastclick']
    },
    shim: {
      
    }
  },
  selectors: {
    'body': ['app/app']
  }

});