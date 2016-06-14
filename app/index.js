if (module.hot) {
  module.hot.accept();
}
require('./index.html');
require('./style/index.less');
require('./app.tag');

riot.mount('*');
