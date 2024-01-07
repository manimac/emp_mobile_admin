import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { OrderHistoriesComponent } from './pages/order-histories/order-histories.component';
import { UsersComponent } from './pages/users/users.component';
import { StaffsComponent } from './pages/staffs/staffs.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { PeekHoursComponent } from './pages/peek-hours/peek-hours.component';
import { AppRoutingModule } from './app-routing.module';
import { PickupLocationsComponent } from './pages/pickup-locations/pickup-locations.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { EnquiriesComponent } from './pages/enquiries/enquiries.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ckeditor4-angular';
import { FilterOptionsComponent } from './pages/filter-options/filter-options.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CategoryFilterPipe } from './shared/categoryfilter.pipe';
import { ExtrasComponent } from './pages/extras/extras.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FilterOrderIdPipe, LoadServicesPipe, FilterUsersNamePipe, FilterUsersEmailPipe, FilterUsersPhonePipe } from './pipes/load-services/load-services.pipe';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { WithDrawRequestComponent } from './pages/with-draw-request/with-draw-request.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { SpecificationComponent } from './pages/specification/specification.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { PlaceOrdersComponent } from './pages/place-orders/place-orders.component';
import { InterestsComponent } from './pages/interests/interests.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { InvoiceComponent } from './pages/invoice/invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    VehiclesComponent,
    OrderHistoriesComponent,
    UsersComponent,
    StaffsComponent,
    AboutUsComponent,
    ContactUsComponent,
    FaqComponent,
    LocationsComponent,
    PeekHoursComponent,
    PickupLocationsComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    EnquiriesComponent,
    FilterOptionsComponent,
    LoginComponent,
    CategoryFilterPipe,
    ExtrasComponent,
    ChangePasswordComponent,
    LoadServicesPipe,
    FilterUsersNamePipe,
    FilterUsersEmailPipe,
    FilterUsersPhonePipe,
    TermsAndConditionsComponent,
    WithDrawRequestComponent,
    FilterOrderIdPipe,
    MaintenanceComponent,
    CouponsComponent,
    AdvertisementComponent,
    UserDetailComponent,
    CertificateComponent,
    SpecificationComponent,
    AssignmentsComponent,
    PlaceOrdersComponent,
    InterestsComponent,
    RegisterComponent,
    CategoriesComponent,
    CompanyProfileComponent,
    CalendarComponent,
    InvoiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
