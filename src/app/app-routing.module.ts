import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { VijestiComponent } from './components/vijesti/vijesti.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VijestiAddComponent } from './components/admin/vijesti-add/vijesti-add.component';
import { DashboardIndexComponent } from './components/admin/dashboard-index/dashboard-index.component';
import { KategorijeVijestiComponent } from './components/admin/kategorije-vijesti/kategorije-vijesti.component';
import { KategorijeVijestiAddComponent } from './components/admin/kategorije-vijesti-add/kategorije-vijesti-add.component';
import { KategorijeVijestiIzmjenaComponent } from './components/admin/kategorije-vijesti-izmjena/kategorije-vijesti-izmjena.component';
import { SveVijestiComponent } from './components/admin/sve-vijesti/sve-vijesti.component';
import { VijestiIzmjenaComponent } from './components/admin/vijesti-izmjena/vijesti-izmjena.component';
import { VijestComponent } from './components/vijest/vijest.component';
import { KurseviComponent } from './components/admin/kursevi/kursevi.component';
import { KategorijeKurseviComponent } from './components/admin/kategorije-kursevi/kategorije-kursevi.component';
import { KategorijeKurseviAddComponent } from './components/admin/kategorije-kursevi-add/kategorije-kursevi-add.component';
import { KategorijeKurseviIzmjenaComponent } from './components/admin/kategorije-kursevi-izmjena/kategorije-kursevi-izmjena.component';
import { KursAddComponent } from './components/admin/kurs-add/kurs-add.component';
import { KursIzmjenaComponent } from './components/admin/kurs-izmjena/kurs-izmjena.component';
import { ObukeComponent } from './components/admin/obuke/obuke.component';
import { ObukaAddComponent } from './components/admin/obuka-add/obuka-add.component';
import { ObukaIzmjenaComponent } from './components/admin/obuka-izmjena/obuka-izmjena.component';
import { DogadjajiComponent } from './components/admin/dogadjaji/dogadjaji.component';
import { DogadjajAddComponent } from './components/admin/dogadjaj-add/dogadjaj-add.component';
import { DogadjajIzmjenaComponent } from './components/admin/dogadjaj-izmjena/dogadjaj-izmjena.component';
import { UploaderComponent } from './components/admin/uploader/uploader.component';
import { SvePublikacijeComponent } from './components/admin/sve-publikacije/sve-publikacije.component';
import { PublikacijaIzmjenaComponent } from './components/admin/publikacija-izmjena/publikacija-izmjena.component';
import { KursComponent } from './components/kurs/kurs.component';
import { PrijavaComponent } from './components/prijava/prijava.component';
import { PrijaveComponent } from './components/admin/prijave/prijave.component';
import { AngularFireAuthGuard, redirectLoggedInTo, canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { VijestiSveComponent } from './components/vijesti-sve/vijesti-sve.component';
import { PublikacijeComponent } from './components/publikacije/publikacije.component';
import { UslugeComponent } from './components/usluge/usluge.component';
import { OblastComponent } from './components/oblast/oblast.component';
import { ONamaComponent } from './components/o-nama/o-nama.component';
import { DogadjajComponent } from './components/dogadjaj/dogadjaj.component';
import { PretragaComponent } from './components/pretraga/pretraga.component';
import { HvalaComponent } from './components/hvala/hvala.component';
import { PruzaociUslugaComponent } from './components/pruzaoci-usluga/pruzaoci-usluga.component';
import { RazvojKapacitetaComponent } from './components/razvoj-kapaciteta/razvoj-kapaciteta.component';
import { KorisniciUslugaComponent } from './components/korisnici-usluga/korisnici-usluga.component';
import { OkruzenjeZaObrazovanjeOdraslihComponent } from './components/okruzenje-za-obrazovanje-odraslih/okruzenje-za-obrazovanje-odraslih.component';

const redirectLoggedIndashboard = () => redirectLoggedInTo(['dashboard']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [

  { path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectLoggedIndashboard}},
  {path: 'vijesti', component: VijestiSveComponent},
  {path: 'usluge', component: UslugeComponent},
  {path: 'pruzaoci-usluga', component: PruzaociUslugaComponent},
  {path: 'razvoj-kapaciteta', component: RazvojKapacitetaComponent},
  {path: 'korisnici-usluga', component: KorisniciUslugaComponent},
  {path: 'okruzenje-za-obrazovanje-odraslih', component: OkruzenjeZaObrazovanjeOdraslihComponent},
  {path: 'oblasti', component: OblastComponent},
  {path: 'vijest/:id', component: VijestComponent},
  {path: 'dogadjaj/:id', component: DogadjajComponent},
  {path: 'pretraga/:p', component: PretragaComponent},
  {path: 'o-nama', component: ONamaComponent},
  {path: 'kurs/:id/:p', component: KursComponent},
  {path: 'prijava/:id/:naziv/:p', component: PrijavaComponent},
  { path: 'hvala', component: HvalaComponent},
  { path: 'registracija', component: SignUpComponent },
  { path: 'publikacije', component: PublikacijeComponent },
  { path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {path: '', component: DashboardIndexComponent},
      {path: 'dogadjaji', component: DogadjajiComponent},
      {path: 'kursevi', component: KurseviComponent},
      {path: 'obuke', component: ObukeComponent},
      {path: 'prijave', component: PrijaveComponent},
      {path: 'prijave/:p', component: PrijaveComponent},
      {path: 'novi-dogadjaj', component: DogadjajAddComponent},
      {path: 'nova-obuka', component: ObukaAddComponent},
      {path: 'novi-kurs', component: KursAddComponent},
      {path: 'vijesti', component: SveVijestiComponent},
      {path: 'nova-vijest', component: VijestiAddComponent},
      {path: 'nova-kategorija-vijesti', component: KategorijeVijestiAddComponent},
      {path: 'kategorije-vijesti', component: KategorijeVijestiComponent},
      {path: 'kategorije-kursevi', component: KategorijeKurseviComponent},
      {path: 'nova-kategorija-kurs', component: KategorijeKurseviAddComponent},
      {path: 'izmjena-kategorija-vijest/:id', component: KategorijeVijestiIzmjenaComponent},
      {path: 'izmjena-kategorija-kurs/:id', component: KategorijeKurseviIzmjenaComponent},
      {path: 'izmjena-vijest/:id', component: VijestiIzmjenaComponent},
      {path: 'izmjena-kurs/:id', component: KursIzmjenaComponent},
      {path: 'izmjena-obuka/:id', component: ObukaIzmjenaComponent},
      {path: 'izmjena-dogadjaj/:id', component: DogadjajIzmjenaComponent},
      {path: 'izmjena-publikacija/:id', component: PublikacijaIzmjenaComponent},
      {path: 'nova-publikacija', component: UploaderComponent},
      {path: 'publikacije', component: SvePublikacijeComponent}
    ] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    }),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
