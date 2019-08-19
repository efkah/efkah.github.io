var Fk = Fk || {};
Fk.sideScroll = function (settings) {
    let self = this, log = settings.log, ns = "Fk.sideScroll";

    this.Settings = settings || {
        ViewWidth: (window.innerWidth > 980) ? 40 : 90,
        Container: document.querySelector("#section0"),
        Items: document.querySelectorAll("#section0>article"),
    }

    this.selectItemById = function (itemId) {
        !log || console.info(`${ns}.selectItemById(itemId)`, itemId);
        self.SelectedItemId = itemId;
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
        return self;
    }

    this.selectNextItem = function () {
        !log || console.info(`${ns}.selectNextItem()`);
        let itemId = self.SelectedItemId + 1;
        return self.selectItemById(itemId);
    }
    this.selectPreviousItem = function () {
        !log || console.info(`${ns}.selectPreviousItem(e)`);
        let itemId = self.SelectedItemId - 1;
        return self.selectItemById(itemId);
    }

    var dragHelper  = {x: 0, y: 0, itemId: null, isDragging: false }
    var dragStartEventHandler = function (e) {
        e = e || window.event;
        // e.preventDefault();

        dragHelper.itemId = self.SelectedItemId;

        if (e.type == 'touchstart') {
            dragHelper.x = e.touches[0].clientX;
            dragHelper.y = e.touches[0].clientY;
        } else {
            dragHelper.x = e.clientX;
            dragHelper.y = e.clientY;
            document.onmouseup = dragEndEventHandler;
            document.onmousemove = dragActionEventHandler;
        }
        !log || console.info(`${ns}.dragStartEventHandler(e)`, e);
    }

    var dragActionEventHandler = function (e) {
        !log || console.info(`${ns}.dragActionEventHandler(e)`, e);
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
            if (dirX < -.1 || dirX > .1) {
                self.selectItemById(dragHelper.itemId - dirX);
            }
        }
    }

    var dragEndEventHandler = function (e) {
        !log || console.info(`${ns}.dragEndEventHandler(e)`, e);
        // e.preventDefault();

        if (self.SelectedItemId < 0) {
            self.selectItemById(0);
            dragHelper.isDragging = false;
        } else 
        if (self.SelectedItemId > (self.Settings.Items.length - 1)) {
            self.selectItemById((self.Settings.Items.length - 1));
            dragHelper.isDragging = false;
        }
        
        var selectItemId = Math.round(self.SelectedItemId)
        if (dragHelper.itemId != selectItemId) {
            self.selectItemById(selectItemId);
            e.stopPropagation();
        }
        document.onmouseup = null;
        document.onmousemove = null;
        dragHelper.itemId = null;
    }

    var clickVisibleItemEventHandler = function (e) {
        !log || console.info(`${ns}.clickVisibleItemEventHandler(e)`, e);
        let itemId = parseInt(e.target.closest(".card").dataset.index);
        if (itemId != self.SelectedItemId) {
            e.preventDefault();
            if (dragHelper.isDragging) {
                dragHelper.isDragging = false;
            } else {
                self.selectItemById(itemId);
            }
        }
    }
    var selectNextItemEventHandler = function (e) {
        !log || console.info(`${ns}.selectNextItemEventHandler(e)`, e);
        console.log(self.SelectedItemId);
        e.preventDefault();
        e.stopPropagation();
        
        self.selectNextItem();
    }
    var selectPreviousItemEventHandler = function (e) {
        !log || console.info(`${ns}.selectPreviousItemEventHandler(e)`, e);
        console.log(self.SelectedItemId);
        e.preventDefault();
        e.stopPropagation();
        
        self.selectPreviousItem();
    }

    var init = function () {
        !log || console.info(`${ns}.init()`);
        let itemId = 0;
        self.SelectedItemId = 0;

        self.Settings.Items.forEach(item => {
            item.dataset.index = itemId;
            item.style.transformOrigin = `${(((itemId - 1) * - self.Settings.ViewWidth) - self.Settings.ViewWidth / 2)}vw ${itemId * 5}vw`;

            item.addEventListener("click", clickVisibleItemEventHandler, {capture: false});
            if (itemId > 0) {
                let backButton = document.createElement("div");
                backButton.innerText = "<";
                backButton.classList.add("back-button");
                backButton.classList.add("sidescroll-nav");
                backButton.addEventListener("click", selectPreviousItemEventHandler, {capture: true});
                backButton.addEventListener("touchstart", selectPreviousItemEventHandler, {capture: true});
                item.appendChild(backButton);
            }
            if (itemId < self.Settings.Items.length - 1) {
                let nextButton = document.createElement("div");
                nextButton.innerText = ">";
                nextButton.classList.add("next-button");
                nextButton.classList.add("sidescroll-nav");
                nextButton.addEventListener("click", selectNextItemEventHandler, {capture: true});
                nextButton.addEventListener("touchstart", selectNextItemEventHandler, {capture: true});
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
        self.Settings.Container.addEventListener('mousedown', dragStartEventHandler, {capture: true});

        // Touch events
        self.Settings.Container.addEventListener('touchstart', dragStartEventHandler, {capture: true});
        self.Settings.Container.addEventListener('touchend', dragEndEventHandler, {capture: true});
        self.Settings.Container.addEventListener('touchmove', dragActionEventHandler, {capture: true});

        self.selectItemById(0);
    }

    init();
    !log || console.info(`${ns}(settings)`, settings);
}