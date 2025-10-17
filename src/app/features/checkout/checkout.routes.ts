import { Routes } from "@angular/router";

const checkoutRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./checkout.component')
    }
]

export default checkoutRoutes;