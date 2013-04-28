requirejs.config({
    paths: {
        "sample": "../sample",
        "mobileui": "../../src",
        "third-party": "../../third-party/dev/"
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
require(["main"]);