import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { FaqComponent } from './pages/faq/faq.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { OrderHistoriesComponent } from './pages/order-histories/order-histories.component';
import { PeekHoursComponent } from './pages/peek-hours/peek-hours.component';
import { UsersComponent } from './pages/users/users.component';
import { StaffsComponent } from './pages/staffs/staffs.component';
import { PickupLocationsComponent } from './pages/pickup-locations/pickup-locations.component';
import { EnquiriesComponent } from './pages/enquiries/enquiries.component';
import { FilterOptionsComponent } from './pages/filter-options/filter-options.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { ExtrasComponent } from './pages/extras/extras.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { WithDrawRequestComponent } from './pages/with-draw-request/with-draw-request.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { SpecificationComponent } from './pages/specification/specification.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PlaceOrdersComponent } from './pages/place-orders/place-orders.component';
import { InterestsComponent } from './pages/interests/interests.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';

const routes: Routes = [
  { path: '', redirectTo: '/assignments', pathMatch: 'full' },
  { path: 'assignments', component: OrdersComponent, canActivate: [AuthGuardService] },
  { path: 'place-order', component: PlaceOrdersComponent, canActivate: [AuthGuardService] },
  { path: 'company-profile', component: CompanyProfileComponent, canActivate: [AuthGuardService] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardService] },
  { path: 'interests', component: InterestsComponent, canActivate: [AuthGuardService] },
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuardService] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuardService] },
  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuardService] },
  { path: 'filter-options', component: FilterOptionsComponent, canActivate: [AuthGuardService] },
  { path: 'about-us', component: AboutUsComponent, canActivate: [AuthGuardService] },
  { path: 'contact-us', component: ContactUsComponent, canActivate: [AuthGuardService] },
  { path: 'faq', component: FaqComponent, canActivate: [AuthGuardService] },
  { path: 'locations', component: LocationsComponent, canActivate: [AuthGuardService] },
  { path: 'pickup-location', component: PickupLocationsComponent, canActivate: [AuthGuardService] },
  { path: 'order-histories', component: OrderHistoriesComponent, canActivate: [AuthGuardService] },
  { path: 'peek-hours', component: PeekHoursComponent, canActivate: [AuthGuardService] },
  { path: 'enquiries', component: EnquiriesComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
  { path: 'staffs', component: StaffsComponent, canActivate: [AuthGuardService] },
  { path: 'extras', component: ExtrasComponent, canActivate: [AuthGuardService] },
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent, canActivate: [AuthGuardService] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'withdraw-request', component: WithDrawRequestComponent, canActivate: [AuthGuardService] },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [AuthGuardService] },
  { path: 'coupons', component: CouponsComponent, canActivate: [AuthGuardService] },
  { path: 'advertisement', component: AdvertisementComponent, canActivate: [AuthGuardService] },
  { path: 'certificates', component: CertificateComponent, canActivate: [AuthGuardService] },
  { path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'specifications', component: SpecificationComponent },
  { path: '**', component: VehiclesComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
