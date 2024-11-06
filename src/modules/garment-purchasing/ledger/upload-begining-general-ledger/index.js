export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List' },
            { route: 'upload', moduleId: './upload', name: 'upload', nav: false, title: 'Upload' },
        ]);
        this.router = router;
    }
}