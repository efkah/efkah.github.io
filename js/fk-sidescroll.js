var Fk = Fk || {};
Fk.sideScroll = function (settings) {
    let self = this, fk = true, ns = "Fk.sideScroll";

    this.Settings = settings || {
        ViewWidth: (window.innerWidth > 980) ? 40 : 90,
        Container: document.querySelector("#section0"),
        Items: document.querySelectorAll("#section0>article")
    }

    this.selectItemById = function (itemId) {
        self.selectedItem = itemId;
        i = 0;
        self.Settings.Items.forEach(item => {
            if (i < itemId) {
                item.style.transform = `rotate(${(i - itemId) * 5}deg) translateX(${itemId * -self.Settings.ViewWidth}vw)`;
                item.style.opacity = .9;
                // item.style.boxShadow = "0.1em 0.1em 0.4em #363020";
                item.style.zIndex = 1499;
            } else if (i == itemId) {
                item.style.transform = `translateX(${itemId * -self.Settings.ViewWidth}vw)`;
                item.classList.remove("sidescroll-nav-hidden");
                item.style.opacity = 1;
                // item.style.boxShadow = "unset";
                item.style.zIndex = 1500;
            } else {
                item.style.transform = `rotate(${(i -itemId) * 5}deg) translateX(${itemId * -self.Settings.ViewWidth}vw)`;
                // item.style.opacity = 1 - ((i - itemId) * .2);
                // item.style.backgroundColor = "#ecf8f866";
                item.classList.add("sidescroll-nav-hidden");
                item.style.zIndex = 1500 - i;
            }
            i++;
        });
        
        

        fk || console.info(`${ns}.selectItemById(itemId)`, itemId);
    }

    this.selectNextItem = function (e) {
        e.preventDefault();
        e.stopPropagation();
        let itemId = self.selectedItem + 1;
        self.selectItemById(itemId);
        fk || console.info(`${ns}.selectNextItem(e)`, e);
    }
    this.selectPreviousItem = function (e) {
        e.preventDefault();
        e.stopPropagation();
        let itemId = self.selectedItem - 1;
        self.selectItemById(itemId);
        fk || console.info(`${ns}.selectPreviousItem(e)`, e);
    }

    var dragHelper  = {x: 0, y: 0, itemId: null, isDragging: false }
    var dragStartEventHandler = function (e) {
        e = e || window.event;
        e.preventDefault();

        dragHelper.itemId = self.selectedItem;

        if (e.type == 'touchstart') {
            dragHelper.x = e.touches[0].clientX;
            dragHelper.y = e.touches[0].clientY;
        } else {
            dragHelper.x = e.clientX;
            dragHelper.y = e.clientY;
            document.onmouseup = dragEndEventHandler;
            document.onmousemove = dragActionEventHandler;
        }
        fk || console.info(`${ns}.dragStartEventHandler(e)`, e);
    }

    var dragActionEventHandler = function (e) {
        e = e || window.event;
        e.preventDefault();
        dragHelper.isDragging = true;

        let dirX = null;
        let dirY = null;
        if (e.type == 'touchmove') {
            dirX = (e.touches[0].clientX - dragHelper.x) / (window.innerWidth);
            dirY = (e.touches[0].clientY - dragHelper.y) / (window.innerHeight);
        } else {
            if (e.clientX < dragHelper.x) {
                dirX = (e.clientX - dragHelper.x) / dragHelper.x;
            } else {
                {
                    dirX = (e.clientX - dragHelper.x) / (window.innerWidth - dragHelper.x);
                }
            }
            dirY = (e.clientY - dragHelper.y) / (window.innerHeight - dragHelper.y);
        }
        if (-1 > dirY < 1) {
            self.selectItemById(dragHelper.itemId - dirX);
        }
        fk || console.info(`${ns}.dragActionEventHandler(e)`, e);
    }

    var dragEndEventHandler = function (e) {
        e.preventDefault();

        //     console.info(dragHelper.itemId , dragHelper.sectionId);
        //     let dirX = (e.clientX - dragHelper.x) / (window.innerWidth / 10) || 0;
        //     let dirY = (e.clientY - dragHelper.y) / (window.innerHeight / 10) || 0;
        //     console.log(dirX, dirY)
        //     if (-1 > dirY < 1) {
        //         if (dirX < -1) {
        //             console.log("self.selectPreviousItem()");
        //             self.selectPreviousItem();
        //         } else if (dirX > 1) {
        //             console.log("self.selectNextItem()");
        //             self.selectNextItem();
        //         }        
        //     }

        // var bounds = (0 <= itemId) && (itemId <= (self.Settings.Items.length - 1));
        // console.log(0, itemId, (self.Settings.Items.length - 1), bounds);

        console.log(self.selectedItem);
        if (self.selectedItem < 0) {
            self.selectItemById(0);
            dragHelper.isDragging = false;
        } else if (self.selectedItem > (self.Settings.Items.length - 1)) {
            self.selectItemById((self.Settings.Items.length - 1));
            dragHelper.isDragging = false;
        }
        
            self.selectItemById(Math.round(self.selectedItem));

        e.stopPropagation();
        document.onmouseup = null;
        document.onmousemove = null;
        dragHelper.itemId = null;
        fk || console.info(`${ns}.dragEndEventHandler(e)`, e);
    }

    var clickVisibleItemEventHandler = function (e) {
        e.preventDefault();
        let itemId = parseInt(e.target.closest("article").dataset.index);
        if (dragHelper.isDragging) {
            dragHelper.isDragging = false;
        } else {
            self.selectItemById(itemId);
        }
        fk || console.info(`${ns}.clickVisibleItemEventHandler(e)`, e);
    }

    var init = function () {
        let itemId = 0;
        self.selectedItem = 0;

        self.Settings.Items.forEach(item => {
            item.dataset.index = itemId;
            item.style.transformOrigin = `${((itemId - 1) * -self.Settings.ViewWidth)}vw ${itemId * 5}vw`;

            item.addEventListener("click", clickVisibleItemEventHandler, {capture: true});
            if (itemId > 0) {
                let backButton = document.createElement("div");
                backButton.innerText = "<";
                backButton.classList.add("back-button");
                backButton.classList.add("sidescroll-nav");
                backButton.addEventListener("click", self.selectPreviousItem, {capture: true});
                item.appendChild(backButton);
            }
            if (itemId < self.Settings.Items.length - 1) {
                let nextButton = document.createElement("div");
                nextButton.innerText = ">";
                nextButton.classList.add("next-button");
                nextButton.classList.add("sidescroll-nav");
                nextButton.addEventListener("click", self.selectNextItem, {capture: true});
                item.appendChild(nextButton);
            }
            itemId++
        });

        self.selectItemById(0);

        let gridTemplateColumns = "";
        self.Settings.Items.forEach(item => {
            gridTemplateColumns += self.Settings.ViewWidth + "vw ";
            item.style.transition = "all .3s ease-in";
        });
        self.Settings.Container.style.gridTemplateColumns = gridTemplateColumns;
        // Mouse events
        // self.Settings.Container.onmousedown = dragStartEventHandler;
        self.Settings.Container.addEventListener('mousedown', dragStartEventHandler, {capture: false});

        // Touch events
        self.Settings.Container.addEventListener('touchstart', dragStartEventHandler, {capture: false});
        self.Settings.Container.addEventListener('touchend', dragEndEventHandler, {capture: false});
        self.Settings.Container.addEventListener('touchmove', dragActionEventHandler, {capture: false});

        self.selectItemById(0, 0);
        fk || console.info(`${ns}.init()`);
    }

    init();
    fk || console.info(`${ns}(settings)`, settings);
}