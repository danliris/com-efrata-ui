export class Index {
  configureRouter(config, router) {
    config.map([
        {route:['', 'report'], moduleId:'./report', name:'report', nav:true, title:'Laporan Stok (PER RO)'}
    ]);
    this.router = router;
  }
}