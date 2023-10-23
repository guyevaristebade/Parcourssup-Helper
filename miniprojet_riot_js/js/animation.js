function tagsAnimations() {

    
    let animations = {
        starterAnimation,
        AnimationItemsMenu
    }

    /**
     * permet d'animer des composants au démarage de l'application
    */
    function starterAnimation(menu,stat,canvas,map,table,lien){
        anime({
            targets: menu,
            translateX: [-100, 0],
            opacity: [0, 1],
            delay: anime.stagger(500),
        })

        anime({
            targets: stat,
            translateY: [-100, 0],
            opacity: [0, 1],
            delay: 600,
        })

        anime({
            targets: canvas,
            translateY: [0, 0],
            opacity: [0, 1],
            delay: 800,
        })

        anime({
            targets: map,
            translateX: [-100, 0],
            opacity: [0, 1],
            delay: 1000,
        })

        anime({
            targets: table,
            translateY: [100, 0],
            opacity: [0, 1],
            delay: 800,
        })

        anime({
            targets: lien,
            translateY: [-100, 0],
            opacity: [0, 1],
            delay: 100,
        })
    }

    /**
     * permet d'animer les items du composant my-menu
    */
    function AnimationItemsMenu(component){
        anime({
            targets:component,
            translateX: [-100, 0],
            opacity: [0, 1],
            delay: 200,
        })
    }

    return animations
}