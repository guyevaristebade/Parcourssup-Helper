riot.compile().then(() => {
    let sa=makeServiceAjax();
    let anim=tagsAnimations();
    riot.install(function(component){
        component.sa = sa;
        component.anim = anim;
    })
    riot.mount('app')
})