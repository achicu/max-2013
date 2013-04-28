requirejs.config({
    paths: {
        "sample": ".",
        "mobileui": "../../src",
        "third-party": "../../third-party/dev/"
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
require(["sample/main"]);