export class Header{
  
  private selectors: Record<string, string> = {
    root: '[data-js-header]',
    overlay: '[data-js-header-overlay]',
    burger: '[data-js-header-burger]',
  }

  private stateClasses: Record<string, string> = {
    isActive: 'is-active',
    isLock: 'is-lock',
  }

  private rootElement: HTMLElement | null;
  private overlayElement: HTMLElement | null;
  private burgerElement: HTMLElement | null;

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (this.rootElement) {
      this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
      this.burgerElement = this.rootElement.querySelector(this.selectors.burger);
      this.bindEvents();
    } else{
      this.overlayElement = null;
      this.burgerElement = null;
    }
  }

  private bindEvents(): void{
    this.burgerElement?.addEventListener('click', this.onBurgerClick);
  }
  

  private onBurgerClick = (): void =>{
    this.overlayElement?.classList.toggle(this.stateClasses.isActive);
    this.burgerElement?.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
  }


}