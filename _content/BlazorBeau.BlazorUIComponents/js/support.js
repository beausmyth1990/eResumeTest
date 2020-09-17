/* Provides all of the necessary supporting JS functions for interop within components */

// Check if the observer API is supported
let observerApiSupported = ('IntersectionObserver' in window) ? true : false;

let observables = new WeakMap();

let windowLoaded = false;

let options = {
    rootMargin: '-50px'
}

let callback = (entries, observer) => {
    entries.forEach(entry => {

        let element = entry.target;

        if (entry.isIntersecting && observables.has(element)) {
            
            let dotNetObj = observables.get(element);
            dotNetObj.invokeMethodAsync('PerformAction');
            observer.unobserve(element);
            observables.delete(element);
        }
    });
};

let observer = new IntersectionObserver(callback, options);

window.observeElement = function (element, dotNetObj) {

    if (observerApiSupported) { // set the element in weakmap to reference the DotNetComponent
        
        observables.set(element, dotNetObj);
        observer.observe(element);
    }
    else { // if intersectionObserver not supported then perform action immediately
        dotNetObj.invokeMethodAsync('PerformAction');
    }
}