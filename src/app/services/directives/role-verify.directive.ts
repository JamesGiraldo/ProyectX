import { Directive, TemplateRef, ViewContainerRef, Input, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { AuthenticationService } from '../authentication.service';

@Directive({
  selector: '[appRoleVerify]'
})
export class RoleVerifyDirective implements OnInit {

  private CurrentUserPermiso: any;
  private Permission: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private globalService: GlobalService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    const token = this.globalService.getToken();
    const tokenInfo = this.authService.getDecodedAccessToken(token);
    const role = tokenInfo.type;
    this.Permission = role;
    this.updateView();
  }

  @Input()
  set appRoleVerify(val: any){
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.CurrentUserPermiso = val;
    this.updateView();
  }

  private updateView(): void{
    this.viewContainer.clear();
    if (this.checkPermission()) this.viewContainer.createEmbeddedView(this.templateRef);
  }

  private checkPermission(): boolean{
    let hasPermission = true;
    if (this.Permission && this.CurrentUserPermiso) {
      const permisoEncotrado = this.CurrentUserPermiso.find(p => {
        return ( `USER.TYPE.${ p.toUpperCase().trim() }` === this.Permission.toUpperCase().trim());
      });
      if (permisoEncotrado) hasPermission = false;
    }
    return hasPermission;
  }

}
