import { APP_CONFIG, APP_LAUNCHER_PLUGIN, BaseEnvironmentService } from '@airgap/angular-core'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { TestModuleMetadata } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { AlertController, IonicModule, NavController, Platform, ToastController } from '@ionic/angular'
import { Drivers, Storage } from '@ionic/storage'
import { IonicStorageModule } from '@ionic/storage-angular'
import { StoreModule } from '@ngrx/store'
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core'

import { ENVIRONMENT_PLUGIN } from '../src/app/capacitor-plugins/injection-tokens'
import { ComponentsModule } from '../src/app/components/components.module'
import { appConfig } from '../src/app/config/app-config'
import { PipesModule } from '../src/app/pipes/pipes.module'
import { VaultEnvironmentService } from '../src/app/services/environment/vault-environment.service'

import {
  AlertControllerMock,
  ClipboardMock,
  DeeplinkMock,
  FilesystemMock,
  LoadingControllerMock,
  ModalControllerMock,
  NavControllerMock,
  PlatformMock,
  ToastControllerMock,
  ZipMock
} from './ionic-mocks'
import { AppInfoPluginMock, AppLauncherMock, EnvironmentPluginMock, SaplingPluginMock, SplashScreenMock, StatusBarMock } from './plugins-mocks'
import { StorageMock } from './storage-mock'

export class UnitHelper {
  public readonly mockRefs = {
    appInfo: new AppInfoPluginMock(),
    appLauncher: new AppLauncherMock(),
    platform: new PlatformMock(),
    sapling: new SaplingPluginMock(),
    statusBar: new StatusBarMock(),
    splashScreen: new SplashScreenMock(),
    deeplink: new DeeplinkMock(),
    toastController: new ToastControllerMock(),
    alertController: new AlertControllerMock(),
    loadingController: new LoadingControllerMock(),
    modalController: new ModalControllerMock(),
    clipboard: new ClipboardMock(),
    filesystem: new FilesystemMock(),
    zip: new ZipMock(),
    environment: new EnvironmentPluginMock()
  }

  public testBed(testBed: TestModuleMetadata, useIonicOnlyTestBed: boolean = false): TestModuleMetadata {
    const mandatoryDeclarations: any[] = []
    const mandatoryImports: any[] = [
      CommonModule,
      ReactiveFormsModule,
      IonicModule,
      FormsModule,
      RouterTestingModule,
      HttpClientModule,
      ComponentsModule,
      IonicStorageModule.forRoot({
        name: '__test_airgap_storage',
        driverOrder: [Drivers.LocalStorage]
      }),
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
      }),
      StoreModule.forRoot({})
    ]
    const mandatoryProviders: any[] = [
      { provide: NavController, useClass: NavControllerMock },
      { provide: Platform, useValue: this.mockRefs.platform },
      { provide: ToastController, useValue: this.mockRefs.toastController },
      { provide: AlertController, useValue: this.mockRefs.alertController },
      { provide: APP_LAUNCHER_PLUGIN, useValue: this.mockRefs.appLauncher },
      { provide: APP_CONFIG, useValue: appConfig },
      { provide: ENVIRONMENT_PLUGIN, useValue: this.mockRefs.environment },
      { provide: BaseEnvironmentService, useClass: VaultEnvironmentService }
    ]

    if (!useIonicOnlyTestBed) {
      mandatoryProviders.push({ provide: Storage, useClass: StorageMock })
      mandatoryDeclarations.push()
      mandatoryImports.push(PipesModule)
    }

    testBed.declarations = [...(testBed.declarations || []), ...mandatoryDeclarations]
    testBed.imports = [...(testBed.imports || []), ...mandatoryImports]
    testBed.providers = [...(testBed.providers || []), ...mandatoryProviders]

    return testBed
  }
}

export const newSpy: (name: string, returnValue: any) => jasmine.Spy = (name: string, returnValue: any): jasmine.Spy =>
  jasmine.createSpy(name).and.returnValue(returnValue)
