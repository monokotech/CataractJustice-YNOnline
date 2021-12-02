//those things looks scary, pls rewrite into something more readable

  function setUiTheme(isInit) {
    const themeStyles = document.getElementById('themeStyles');
    getBaseBgColor(function (color) {
      const bgColorPixel = uiThemeBgColor;
      const altColor = 'rgba(' + Math.min(bgColorPixel[0] + 48, 255) + ', ' + Math.min(bgColorPixel[1] + 48, 255) + ', ' + Math.min(bgColorPixel[2] + 48, 255) + ', 1)';
      getFontShadow(function (shadow) {
        themeStyles.textContent = themeStyles.textContent = themeStyles.textContent.replace(new RegExp('url\\(\'images\\/ui\\/(containerbg|border(?:2)?|font\\d)\\.png\'\\)', 'g'), 'url(\'images/ui/$1.png\')')
          .replace(/background-color:( *)[^;!]*(!important)?;( *)\/\*basebg\*\//g, 'background-color:$1' + color + '$2;$3/*basebg*/')
          .replace(/background-color:( *)[^;!]*(!important)?;( *)\/\*altbg\*\//g, 'background-color:$1' + altColor + '$2;$3/*altbg*/')
          .replace(/(?:[#a-zA-Z0-9]+|rgba\([0-9]+, [0-9]+, [0-9]+, [0-9]+\))(;? *)\/\*shadow\*\//g, shadow + '$1/*shadow*/');
      });
    });
  }
  
  function setFontStyle() {
    const themeStyles = document.getElementById('themeStyles');
    const defaultAltFontStyleIndex = 4;
    getFontColor(0, function (baseColor) {
      const altFontStyle = defaultAltFontStyleIndex;
      const altColorCallback = function (altColor) {
        themeStyles.textContent = themeStyles.textContent = themeStyles.textContent = themeStyles.textContent
          .replace(new RegExp('url\\(\'images\\/ui\\/font\\d\\.png\'\\)( *!important)?;( *)\\/\\*base\\*\\/', 'g'), 'url(\'images/ui/font1.png\')$1;$2/*base*/')
          .replace(new RegExp('url\\(\'images\\/ui\\/font\\d\\.png\'\\)( *!important)?;( *)\\/\\*alt\\*\\/', 'g'), 'url(\'images/ui/font' + (altFontStyle + 1) + '.png\')$1;$2/*alt*/')
          .replace(/([^\-])((?:(?:background|border)\-)?color|stroke):( *)[^;!]*(!important)?;( *)\/\*base\*\//g, '$1$2:$3' + baseColor + '$4;$5/*base*/')
          .replace(/([^\-])((?:(?:background|border)\-)?color|stroke):( *)[^;!]*(!important)?;( *)\/\*alt\*\//g, '$1$2:$3' + altColor + '$4;$5/*alt*/');
      };
      getFontColor(altFontStyle, function (altColor) {
        if (altColor !== baseColor)
          altColorCallback(altColor);
        else {
          const fallbackAltFontStyle = defaultAltFontStyleIndex + 1;
          getFontColor(fallbackAltFontStyle, altColorCallback);
        }
      });
    });
  }
  
  let uiThemeBgColor = null;
  let uiThemeFontShadow = null;
  let uiThemeFontColors = null;
  
  function getFontColor(fontStyle, callback) {
    if (!uiThemeFontColors)
      uiThemeFontColors = {};
    let pixel = uiThemeFontColors[fontStyle];
    if (pixel)
      return callback('rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', 1)');
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      pixel = context.getImageData(0, 8, 1, 1).data;
      uiThemeFontColors[fontStyle] = [ pixel[0], pixel[1], pixel[2] ];
      callback('rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', 1)');
      canvas.remove();
    };
    img.src = 'images/ui/font' + (fontStyle + 1) + '.png';
  }

  function getFontShadow(callback) {
    let pixel = uiThemeFontShadow;
    if (pixel)
      return callback('rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', 1)');
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      pixel = context.getImageData(0, 8, 1, 1).data;
      uiThemeFontShadow = [ pixel[0], pixel[1], pixel[2] ];
      callback('rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', 1)');
      canvas.remove();
    };
    img.src = 'images/ui/fontshadow.png';
  }

  function getBaseBgColor(callback) {
    const img = new Image();
    let pixel = uiThemeBgColor;
    if (pixel)
      return callback('rgba(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ', 1)');
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      pixel = context.getImageData(0, 0, 1, 1).data;
      const pixel2 = context.getImageData(4, 4, 1, 1).data;
      const pixel3 = context.getImageData(8, 8, 1, 1).data;
      const r = Math.round((pixel[0] + pixel2[0] + pixel3[0]) / 3);
      const g = Math.round((pixel[1] + pixel2[1] + pixel3[1]) / 3);
      const b = Math.round((pixel[2] + pixel2[2] + pixel3[2]) / 3);
      uiThemeBgColor = [ r, g, b ];
      callback('rgba(' + r + ', ' + g + ', ' + b + ', 1)');
      canvas.remove();
    };
    img.src = 'images/ui/containerbg.png';
  }

  setUiTheme();
  setFontStyle();