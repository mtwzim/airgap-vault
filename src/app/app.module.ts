import {
  AirGapAngularCoreModule,
  AirGapTranslateLoader,
  AppInfo,
  APP_CONFIG,
  APP_INFO_PLUGIN,
  APP_LAUNCHER_PLUGIN,
  APP_PLUGIN,
  ClipboardService,
  CLIPBOARD_PLUGIN,
  DeeplinkService,
  PermissionsService,
  QrScannerService,
  SerializerService,
  SPLASH_SCREEN_PLUGIN,
  STATUS_BAR_PLUGIN,
  FILESYSTEM_PLUGIN,
  UiEventService,
  ISOLATED_MODULES_PLUGIN,
  Zip,
  ZIP_PLUGIN,
  BaseModulesService,
  BaseEnvironmentService,
  isolatedModules
} from '@airgap/angular-core'
import {
  AirGapAngularNgRxModule,
  currencySymbolNgRxFacade,
  isolatedModulesDetailsNgRxFacade,
  isolatedModulesListNgRxFacade,
  isolatedModulesListPageNgRxFacade
} from '@airgap/angular-ngrx'
import { PercentPipe } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouteReuseStrategy } from '@angular/router'
import { App } from '@capacitor/app'
import { AppLauncher } from '@capacitor/app-launcher'
import { Clipboard } from '@capacitor/clipboard'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar } from '@capacitor/status-bar'
import { FilePicker } from '@capawesome/capacitor-file-picker'
import { DeviceMotion } from '@ionic-native/device-motion/ngx'
import { Diagnostic } from '@ionic-native/diagnostic/ngx'
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular'
import { Drivers } from '@ionic/storage'
import { IonicStorageModule } from '@ionic/storage-angular'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import * as fromRoot from './app.reducers'
import { CameraPreview, Environment, SaplingNative, SecurityUtils } from './capacitor-plugins/definitions'
import {
  CAMERA_PREVIEW_PLUGIN,
  ENVIRONMENT_PLUGIN,
  FILE_PICKER_PLUGIN,
  SAPLING_PLUGIN,
  SECURITY_UTILS_PLUGIN
} from './capacitor-plugins/injection-tokens'
import { appConfig } from './config/app-config'
import { DistributionOnboardingPageModule } from './pages/distribution-onboarding/distribution-onboarding.module'
import { IntroductionPageModule } from './pages/introduction/introduction.module'
import { LocalAuthenticationOnboardingPageModule } from './pages/local-authentication-onboarding/local-authentication-onboarding.module'
import { WarningModalPageModule } from './pages/warning-modal/warning-modal.module'
import { AudioServiceFactory } from './services/audio/audio.factory'
import { AudioNativeService } from './services/audio/audio.native.servive'
import { CameraFactory, CameraFactoryDepHolder } from './services/camera/camera.factory'
import { CameraNativeService } from './services/camera/camera.native.service'
import { DeviceService } from './services/device/device.service'
import { EntropyService } from './services/entropy/entropy.service'
import { ErrorHandlerService } from './services/error-handler/error-handler.service'
import { GyroscopeServiceFactory } from './services/gyroscope/gyroscope.factory'
import { GyroscopeNativeService } from './services/gyroscope/gyroscope.native.service'
import { IACService } from './services/iac/iac.service'
import { InteractionService } from './services/interaction/interaction.service'
import { SecretsService } from './services/secrets/secrets.service'
import { SecureStorageFactory, SecureStorageFactoryDepHolder } from './services/secure-storage/secure-storage.factory'
import { SecureStorageService } from './services/secure-storage/secure-storage.service'
import { ShareUrlService } from './services/share-url/share-url.service'
import { StartupChecksService } from './services/startup-checks/startup-checks.service'
import { VaultStorageService } from './services/storage/storage.service'
import { Filesystem } from '@capacitor/filesystem'
import { InstallationTypePageModule } from './pages/Installation-type/installation-type.module'
import { OnboardingAdvancedModePageModule } from './pages/onboarding-advanced-mode/onboarding-advanced-mode.module'
import { OnboardingWelcomePageModule } from './pages/onboarding-welcome/onboarding-welcome.module'
import { IsolatedModulesOnboardingPageModule } from './pages/isolated-modules-onboarding/isolated-modules-onboarding.module'
import { VaultModulesService } from './services/modules/modules.service'
import { VaultEnvironmentService } from './services/environment/vault-environment.service'
import { SocialRecoveryImportShareService } from './social-recovery-import-share/social-recovery-import-share.service'

export function createTranslateLoader(http: HttpClient): AirGapTranslateLoader {
  return new AirGapTranslateLoader(http, { prefix: './assets/i18n/', suffix: '.json' })
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(fromRoot.reducers, {
      metaReducers: fromRoot.metaReducers,
      /* temporary fix for `ERROR TypeError: Cannot freeze array buffer views with elements` */
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false
      }
    }),
    EffectsModule.forRoot(),
    IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot({
      name: '__airgap_storage',
      driverOrder: [CordovaSQLiteDriver._driver, Drivers.LocalStorage]
    }),
    WarningModalPageModule,
    IntroductionPageModule,
    InstallationTypePageModule,
    OnboardingAdvancedModePageModule,
    OnboardingWelcomePageModule,
    IsolatedModulesOnboardingPageModule,
    DistributionOnboardingPageModule,
    LocalAuthenticationOnboardingPageModule,
    AirGapAngularCoreModule.forRoot({
      factories: {
        currencySymbolFacade: currencySymbolNgRxFacade,
        isolatedModulesDetailsFacade: isolatedModulesDetailsNgRxFacade,
        isolatedModulesListFacade: isolatedModulesListNgRxFacade,
        isolatedModulesListPageFacade: isolatedModulesListPageNgRxFacade
      }
    }),
    AirGapAngularNgRxModule
  ],
  providers: [
    { provide: APP_PLUGIN, useValue: App },
    { provide: APP_INFO_PLUGIN, useValue: AppInfo },
    { provide: APP_LAUNCHER_PLUGIN, useValue: AppLauncher },
    { provide: CAMERA_PREVIEW_PLUGIN, useValue: CameraPreview },
    { provide: CLIPBOARD_PLUGIN, useValue: Clipboard },
    { provide: FILESYSTEM_PLUGIN, useValue: Filesystem },
    { provide: SAPLING_PLUGIN, useValue: SaplingNative },
    { provide: SECURITY_UTILS_PLUGIN, useValue: SecurityUtils },
    { provide: SPLASH_SCREEN_PLUGIN, useValue: SplashScreen },
    { provide: STATUS_BAR_PLUGIN, useValue: StatusBar },
    { provide: APP_CONFIG, useValue: appConfig },
    { provide: ZIP_PLUGIN, useValue: Zip },
    { provide: FILE_PICKER_PLUGIN, useValue: FilePicker },
    { provide: ISOLATED_MODULES_PLUGIN, useFactory: isolatedModules, deps: [Platform] },
    { provide: ENVIRONMENT_PLUGIN, useValue: Environment },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: BaseModulesService, useClass: VaultModulesService },
    { provide: BaseEnvironmentService, useClass: VaultEnvironmentService },
    Diagnostic,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DeviceMotion,
    AudioNativeService,
    SecretsService,
    SecureStorageService,
    DeviceService,
    CameraNativeService,
    EntropyService,
    GyroscopeNativeService,
    QrScannerService,
    StartupChecksService,
    IACService,
    ClipboardService,
    PermissionsService,
    ShareUrlService,
    ErrorHandlerService,
    InteractionService,
    DeeplinkService,
    SerializerService,
    VaultStorageService,
    UiEventService,
    PercentPipe,
    SecureStorageFactoryDepHolder,
    CameraFactoryDepHolder,
    SocialRecoveryImportShareService,
    {
      provide: SecureStorageService,
      useFactory: SecureStorageFactory,
      deps: [SecureStorageFactoryDepHolder]
    },
    {
      provide: CameraNativeService,
      useFactory: CameraFactory,
      deps: [CameraFactoryDepHolder]
    },
    {
      provide: AudioNativeService,
      useFactory: AudioServiceFactory,
      deps: [Platform, PermissionsService]
    },
    {
      provide: GyroscopeNativeService,
      useFactory: GyroscopeServiceFactory,
      deps: [Platform, DeviceMotion]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
