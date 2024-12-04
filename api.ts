import { Connection, hubConnection, Proxy } from "@flipdish/signalr-no-jquery";
import * as Flipdish from "@flipdish/api-client-typescript";

let defaultBasePath = "https://signalr.flipdish.com";

/**
* This class defines signalr configuration
*/
export class SignalRConfiguration {
  public BasePath?: string;
  public BearerToken?: string;
  public Log: boolean;

  public constructor(basePath?: string, bearerToken?: string, log: boolean = false) {
    this.BasePath = basePath;
    this.BearerToken = bearerToken;
    this.Log = log;
  }
};

/**
* This should be created once per web app and stored somehow.
* Please don't create more than once (need to call .Start() to start connection)
*/
export class SignalR {
  private static ActiveConnection: Connection;
  private extraHeaders: any;
  private signalRConfiguration: SignalRConfiguration;
  private started: boolean;

  public AuthorizationHub: AuthorizationHub;
  
  public AnalyticsHub: AnalyticsHub;
  
  public AppHub: AppHub;
  
  public BankAccountHub: BankAccountHub;
  
  public CampaignHub: CampaignHub;
  
  public CardReaderHub: CardReaderHub;
  
  public ChannelHub: ChannelHub;
  
  public CustomerHub: CustomerHub;
  
  public HydraHub: HydraHub;
  
  public MenuCheckpointHub: MenuCheckpointHub;
  
  public MenuHub: MenuHub;
  
  public OrderHub: OrderHub;
  
  public PhoneCallHub: PhoneCallHub;
  
  public PrinterHub: PrinterHub;
  
  public StoreGroupHub: StoreGroupHub;
  
  public StoreHub: StoreHub;
  
  public TeammateHub: TeammateHub;
  
  public TelephonyConfigHub: TelephonyConfigHub;
  
  public VoucherHub: VoucherHub;
  
  public WebhookHub: WebhookHub;
  
  public WebsiteHub: WebsiteHub;
  
  public constructor(signalRConfiguration?:SignalRConfiguration){
    this.signalRConfiguration = signalRConfiguration;

    if(!SignalR.ActiveConnection){
      SignalR.ActiveConnection = hubConnection(signalRConfiguration.BasePath ? signalRConfiguration.BasePath : defaultBasePath);
    }

    this.AuthorizationHub = new AuthorizationHub(SignalR.ActiveConnection.createHubProxy('AuthorizationHub'), signalRConfiguration.Log);
    
    this.AnalyticsHub = new AnalyticsHub(SignalR.ActiveConnection.createHubProxy("AnalyticsHub"), signalRConfiguration.Log);
	
    this.AppHub = new AppHub(SignalR.ActiveConnection.createHubProxy("AppHub"), signalRConfiguration.Log);
	
    this.BankAccountHub = new BankAccountHub(SignalR.ActiveConnection.createHubProxy("BankAccountHub"), signalRConfiguration.Log);
	
    this.CampaignHub = new CampaignHub(SignalR.ActiveConnection.createHubProxy("CampaignHub"), signalRConfiguration.Log);
	
    this.CardReaderHub = new CardReaderHub(SignalR.ActiveConnection.createHubProxy("CardReaderHub"), signalRConfiguration.Log);
	
    this.ChannelHub = new ChannelHub(SignalR.ActiveConnection.createHubProxy("ChannelHub"), signalRConfiguration.Log);
	
    this.CustomerHub = new CustomerHub(SignalR.ActiveConnection.createHubProxy("CustomerHub"), signalRConfiguration.Log);
	
    this.HydraHub = new HydraHub(SignalR.ActiveConnection.createHubProxy("HydraHub"), signalRConfiguration.Log);
	
    this.MenuCheckpointHub = new MenuCheckpointHub(SignalR.ActiveConnection.createHubProxy("MenuCheckpointHub"), signalRConfiguration.Log);
	
    this.MenuHub = new MenuHub(SignalR.ActiveConnection.createHubProxy("MenuHub"), signalRConfiguration.Log);
	
    this.OrderHub = new OrderHub(SignalR.ActiveConnection.createHubProxy("OrderHub"), signalRConfiguration.Log);
	
    this.PhoneCallHub = new PhoneCallHub(SignalR.ActiveConnection.createHubProxy("PhoneCallHub"), signalRConfiguration.Log);
	
    this.PrinterHub = new PrinterHub(SignalR.ActiveConnection.createHubProxy("PrinterHub"), signalRConfiguration.Log);
	
    this.StoreGroupHub = new StoreGroupHub(SignalR.ActiveConnection.createHubProxy("StoreGroupHub"), signalRConfiguration.Log);
	
    this.StoreHub = new StoreHub(SignalR.ActiveConnection.createHubProxy("StoreHub"), signalRConfiguration.Log);
	
    this.TeammateHub = new TeammateHub(SignalR.ActiveConnection.createHubProxy("TeammateHub"), signalRConfiguration.Log);
	
    this.TelephonyConfigHub = new TelephonyConfigHub(SignalR.ActiveConnection.createHubProxy("TelephonyConfigHub"), signalRConfiguration.Log);
	
    this.VoucherHub = new VoucherHub(SignalR.ActiveConnection.createHubProxy("VoucherHub"), signalRConfiguration.Log);
	
    this.WebhookHub = new WebhookHub(SignalR.ActiveConnection.createHubProxy("WebhookHub"), signalRConfiguration.Log);
	
    this.WebsiteHub = new WebsiteHub(SignalR.ActiveConnection.createHubProxy("WebsiteHub"), signalRConfiguration.Log);
	
    var extraHeaders = signalRConfiguration.BearerToken ? { extraHeaders: [{ key: "Authorization", value: `Bearer ${signalRConfiguration.BearerToken}` }] } : {};
  }

  /**
  * Returns true when this method is called the first time
  * In all other cases returns false
  */
  public Start(OnConnectionStarted?: () => void) : boolean {
    if (!this.started) {
      if (this.signalRConfiguration.Log) {
        console.log("Starting connection...")
      }
      this.started = true;
      SignalR.ActiveConnection.start(this.extraHeaders, OnConnectionStarted);
      return true;
    }
    else {
      if (this.signalRConfiguration.Log) {
        console.log("Connection already started...")
      }
      return false;
    }
  }
  
  /**
  * Closes the existing connection so that you can open another one
  */
  public Stop() {
    SignalR.ActiveConnection.stop(false, true);
	SignalR.ActiveConnection = undefined;
  }
}

/**
* Every event received from signalr will be serializable to this type
*/
class SignalrEvent {
    /**
    * Type of the event
    */
    'Type':string;
    /**
    * Body of the event
    */
    'Body':string;
    /**
    * Event created at (UTC)
    */
    'CreateTime':string;
}

/**
* Reply received when calling AuthorizationHub.authorize
*/
export class AuthorizationReply {
    /**
    * Success or failure of authorization
    */
    'IsSuccess':boolean;
    /**
    * Reason of failure of authorization
    */
   'Reason':string;
}

/**
* This hub should be implemented by default, no auto generation
*/
export class AuthorizationHub {
  private proxy: Proxy;
  private log: boolean;

  public constructor(proxy: Proxy, log: boolean){
    this.proxy = proxy;
    this.log = log;
    this.proxy.on("x", () => {}); //This is so that the hub gets registered with the server
  }

  /**
   * Authenticate with the server
   * @param done when authentication reply is received
   * @param error when an error occurs during a call
   */
  public authenticate(): Promise<AuthorizationReply> {
    if(this.log){
      console.log("Authenticating...");
    }
    return this.proxy.invoke("Authenticate", "1.0");
  }
}

/* AnalyticsHub Start */

/**
 * AnalyticsClient Subscription Callback
*/
export interface AnalyticsClientCallback{
  (data: Flipdish.AnalyticsClientEvent): void;
}


/**
 * AnalyticsHub
 */
export class AnalyticsHub {
  private proxy: Proxy;
  private log: boolean;
  
  private AnalyticsClientCallback: AnalyticsClientCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.AnalyticsClientCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("analytics.website", (eventData:SignalrEvent) => {
      var data:Flipdish.AnalyticsClientEvent = JSON.parse(eventData.Body);
      if(this.AnalyticsClientCallback){
        if(this.log){
          console.log("analytics.website received");
          console.log(eventData.Body);
        }
        this.AnalyticsClientCallback(data);
      }
    });
      
  }
  
  public OnAnalyticsClient(callback: AnalyticsClientCallback){
    if(this.log){
      console.log("analytics.website subscribed");
    }
    this.AnalyticsClientCallback = callback;
  }
  public OffAnalyticsClient(callback: AnalyticsClientCallback){
    if(this.log){
      console.log("analytics.website unsubscribed");
    }
	this.AnalyticsClientCallback = undefined;
  }
  
}
/* AnalyticsHub End */


/* AppHub Start */

/**
 * AppCreated Subscription Callback
*/
export interface AppCreatedCallback{
  (data: Flipdish.AppCreatedEvent): void;
}

/**
 * AppUpdated Subscription Callback
*/
export interface AppUpdatedCallback{
  (data: Flipdish.AppUpdatedEvent): void;
}


/**
 * AppHub
 */
export class AppHub {
  private proxy: Proxy;
  private log: boolean;
  
  private AppCreatedCallback: AppCreatedCallback;
  
  private AppUpdatedCallback: AppUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.AppCreatedCallback = undefined;
    
    this.AppUpdatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("app.created", (eventData:SignalrEvent) => {
      var data:Flipdish.AppCreatedEvent = JSON.parse(eventData.Body);
      if(this.AppCreatedCallback){
        if(this.log){
          console.log("app.created received");
          console.log(eventData.Body);
        }
        this.AppCreatedCallback(data);
      }
    });
      
    this.proxy.on("app.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.AppUpdatedEvent = JSON.parse(eventData.Body);
      if(this.AppUpdatedCallback){
        if(this.log){
          console.log("app.updated received");
          console.log(eventData.Body);
        }
        this.AppUpdatedCallback(data);
      }
    });
      
  }
  
  public OnAppCreated(callback: AppCreatedCallback){
    if(this.log){
      console.log("app.created subscribed");
    }
    this.AppCreatedCallback = callback;
  }
  public OffAppCreated(callback: AppCreatedCallback){
    if(this.log){
      console.log("app.created unsubscribed");
    }
	this.AppCreatedCallback = undefined;
  }
  
  public OnAppUpdated(callback: AppUpdatedCallback){
    if(this.log){
      console.log("app.updated subscribed");
    }
    this.AppUpdatedCallback = callback;
  }
  public OffAppUpdated(callback: AppUpdatedCallback){
    if(this.log){
      console.log("app.updated unsubscribed");
    }
	this.AppUpdatedCallback = undefined;
  }
  
}
/* AppHub End */


/* BankAccountHub Start */

/**
 * BankAccountCreated Subscription Callback
*/
export interface BankAccountCreatedCallback{
  (data: Flipdish.BankAccountCreatedEvent): void;
}

/**
 * BankAccountUpdated Subscription Callback
*/
export interface BankAccountUpdatedCallback{
  (data: Flipdish.BankAccountUpdatedEvent): void;
}

/**
 * BankAccountDeleted Subscription Callback
*/
export interface BankAccountDeletedCallback{
  (data: Flipdish.BankAccountDeletedEvent): void;
}


/**
 * BankAccountHub
 */
export class BankAccountHub {
  private proxy: Proxy;
  private log: boolean;
  
  private BankAccountCreatedCallback: BankAccountCreatedCallback;
  
  private BankAccountUpdatedCallback: BankAccountUpdatedCallback;
  
  private BankAccountDeletedCallback: BankAccountDeletedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.BankAccountCreatedCallback = undefined;
    
    this.BankAccountUpdatedCallback = undefined;
    
    this.BankAccountDeletedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("bankaccount.created", (eventData:SignalrEvent) => {
      var data:Flipdish.BankAccountCreatedEvent = JSON.parse(eventData.Body);
      if(this.BankAccountCreatedCallback){
        if(this.log){
          console.log("bankaccount.created received");
          console.log(eventData.Body);
        }
        this.BankAccountCreatedCallback(data);
      }
    });
      
    this.proxy.on("bankaccount.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.BankAccountUpdatedEvent = JSON.parse(eventData.Body);
      if(this.BankAccountUpdatedCallback){
        if(this.log){
          console.log("bankaccount.updated received");
          console.log(eventData.Body);
        }
        this.BankAccountUpdatedCallback(data);
      }
    });
      
    this.proxy.on("bankaccount.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.BankAccountDeletedEvent = JSON.parse(eventData.Body);
      if(this.BankAccountDeletedCallback){
        if(this.log){
          console.log("bankaccount.deleted received");
          console.log(eventData.Body);
        }
        this.BankAccountDeletedCallback(data);
      }
    });
      
  }
  
  public OnBankAccountCreated(callback: BankAccountCreatedCallback){
    if(this.log){
      console.log("bankaccount.created subscribed");
    }
    this.BankAccountCreatedCallback = callback;
  }
  public OffBankAccountCreated(callback: BankAccountCreatedCallback){
    if(this.log){
      console.log("bankaccount.created unsubscribed");
    }
	this.BankAccountCreatedCallback = undefined;
  }
  
  public OnBankAccountUpdated(callback: BankAccountUpdatedCallback){
    if(this.log){
      console.log("bankaccount.updated subscribed");
    }
    this.BankAccountUpdatedCallback = callback;
  }
  public OffBankAccountUpdated(callback: BankAccountUpdatedCallback){
    if(this.log){
      console.log("bankaccount.updated unsubscribed");
    }
	this.BankAccountUpdatedCallback = undefined;
  }
  
  public OnBankAccountDeleted(callback: BankAccountDeletedCallback){
    if(this.log){
      console.log("bankaccount.deleted subscribed");
    }
    this.BankAccountDeletedCallback = callback;
  }
  public OffBankAccountDeleted(callback: BankAccountDeletedCallback){
    if(this.log){
      console.log("bankaccount.deleted unsubscribed");
    }
	this.BankAccountDeletedCallback = undefined;
  }
  
}
/* BankAccountHub End */


/* CampaignHub Start */


/**
 * CampaignHub
 */
export class CampaignHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* CampaignHub End */


/* CardReaderHub Start */

/**
 * KioskBluetoothPairingMode Subscription Callback
*/
export interface KioskBluetoothPairingModeCallback{
  (data: Flipdish.KioskBluetoothPairingModeEvent): void;
}

/**
 * KioskBluetoothTerminalUnpaired Subscription Callback
*/
export interface KioskBluetoothTerminalUnpairedCallback{
  (data: Flipdish.KioskBluetoothTerminalUnpairedEvent): void;
}

/**
 * KioskBluetoothTerminalUpdated Subscription Callback
*/
export interface KioskBluetoothTerminalUpdatedCallback{
  (data: Flipdish.KioskBluetoothTerminalUpdatedEvent): void;
}

/**
 * KioskBluetoothTerminalInitiateUpdateCheck Subscription Callback
*/
export interface KioskBluetoothTerminalInitiateUpdateCheckCallback{
  (data: Flipdish.KioskBluetoothTerminalInitiateUpdateCheckEvent): void;
}

/**
 * KioskBluetoothInstallUpdateInitiate Subscription Callback
*/
export interface KioskBluetoothInstallUpdateInitiateCallback{
  (data: Flipdish.KioskBluetoothInstallUpdateInitiateEvent): void;
}

/**
 * KioskBluetoothTerminalCancelUpdate Subscription Callback
*/
export interface KioskBluetoothTerminalCancelUpdateCallback{
  (data: Flipdish.KioskBluetoothTerminalCancelUpdateEvent): void;
}

/**
 * KioskBluetoothTerminalInstallationStatus Subscription Callback
*/
export interface KioskBluetoothTerminalInstallationStatusCallback{
  (data: Flipdish.KioskBluetoothTerminalInstallationStatusEvent): void;
}

/**
 * KioskBluetoothTerminalFirmwareVersionStatus Subscription Callback
*/
export interface KioskBluetoothTerminalFirmwareVersionStatusCallback{
  (data: Flipdish.KioskBluetoothTerminalFirmwareVersionStatusEvent): void;
}

/**
 * KioskTerminalActionStateChanged Subscription Callback
*/
export interface KioskTerminalActionStateChangedCallback{
  (data: Flipdish.KioskTerminalActionStateChangedEvent): void;
}


/**
 * CardReaderHub
 */
export class CardReaderHub {
  private proxy: Proxy;
  private log: boolean;
  
  private KioskBluetoothPairingModeCallback: KioskBluetoothPairingModeCallback;
  
  private KioskBluetoothTerminalUnpairedCallback: KioskBluetoothTerminalUnpairedCallback;
  
  private KioskBluetoothTerminalUpdatedCallback: KioskBluetoothTerminalUpdatedCallback;
  
  private KioskBluetoothTerminalInitiateUpdateCheckCallback: KioskBluetoothTerminalInitiateUpdateCheckCallback;
  
  private KioskBluetoothInstallUpdateInitiateCallback: KioskBluetoothInstallUpdateInitiateCallback;
  
  private KioskBluetoothTerminalCancelUpdateCallback: KioskBluetoothTerminalCancelUpdateCallback;
  
  private KioskBluetoothTerminalInstallationStatusCallback: KioskBluetoothTerminalInstallationStatusCallback;
  
  private KioskBluetoothTerminalFirmwareVersionStatusCallback: KioskBluetoothTerminalFirmwareVersionStatusCallback;
  
  private KioskTerminalActionStateChangedCallback: KioskTerminalActionStateChangedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.KioskBluetoothPairingModeCallback = undefined;
    
    this.KioskBluetoothTerminalUnpairedCallback = undefined;
    
    this.KioskBluetoothTerminalUpdatedCallback = undefined;
    
    this.KioskBluetoothTerminalInitiateUpdateCheckCallback = undefined;
    
    this.KioskBluetoothInstallUpdateInitiateCallback = undefined;
    
    this.KioskBluetoothTerminalCancelUpdateCallback = undefined;
    
    this.KioskBluetoothTerminalInstallationStatusCallback = undefined;
    
    this.KioskBluetoothTerminalFirmwareVersionStatusCallback = undefined;
    
    this.KioskTerminalActionStateChangedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("cardreaders.kiosk.bluetooth.initiatepairingmode", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothPairingModeEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothPairingModeCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.initiatepairingmode received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothPairingModeCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.unpaired", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalUnpairedEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalUnpairedCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.unpaired received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalUnpairedCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalUpdatedEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalUpdatedCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.updated received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalUpdatedCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.checkforupdates", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalInitiateUpdateCheckEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalInitiateUpdateCheckCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.checkforupdates received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalInitiateUpdateCheckCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.initiateinstallupdatemode", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothInstallUpdateInitiateEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothInstallUpdateInitiateCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.initiateinstallupdatemode received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothInstallUpdateInitiateCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.cancelupdateinstall", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalCancelUpdateEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalCancelUpdateCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.cancelupdateinstall received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalCancelUpdateCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.installationstatus", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalInstallationStatusEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalInstallationStatusCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.installationstatus received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalInstallationStatusCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.firmwareupdateversion", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskBluetoothTerminalFirmwareVersionStatusEvent = JSON.parse(eventData.Body);
      if(this.KioskBluetoothTerminalFirmwareVersionStatusCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.firmwareupdateversion received");
          console.log(eventData.Body);
        }
        this.KioskBluetoothTerminalFirmwareVersionStatusCallback(data);
      }
    });
      
    this.proxy.on("cardreaders.kiosk.bluetooth.terminalactionstatechanged", (eventData:SignalrEvent) => {
      var data:Flipdish.KioskTerminalActionStateChangedEvent = JSON.parse(eventData.Body);
      if(this.KioskTerminalActionStateChangedCallback){
        if(this.log){
          console.log("cardreaders.kiosk.bluetooth.terminalactionstatechanged received");
          console.log(eventData.Body);
        }
        this.KioskTerminalActionStateChangedCallback(data);
      }
    });
      
  }
  
  public OnKioskBluetoothPairingMode(callback: KioskBluetoothPairingModeCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.initiatepairingmode subscribed");
    }
    this.KioskBluetoothPairingModeCallback = callback;
  }
  public OffKioskBluetoothPairingMode(callback: KioskBluetoothPairingModeCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.initiatepairingmode unsubscribed");
    }
	this.KioskBluetoothPairingModeCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalUnpaired(callback: KioskBluetoothTerminalUnpairedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.unpaired subscribed");
    }
    this.KioskBluetoothTerminalUnpairedCallback = callback;
  }
  public OffKioskBluetoothTerminalUnpaired(callback: KioskBluetoothTerminalUnpairedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.unpaired unsubscribed");
    }
	this.KioskBluetoothTerminalUnpairedCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalUpdated(callback: KioskBluetoothTerminalUpdatedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.updated subscribed");
    }
    this.KioskBluetoothTerminalUpdatedCallback = callback;
  }
  public OffKioskBluetoothTerminalUpdated(callback: KioskBluetoothTerminalUpdatedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.updated unsubscribed");
    }
	this.KioskBluetoothTerminalUpdatedCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalInitiateUpdateCheck(callback: KioskBluetoothTerminalInitiateUpdateCheckCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.checkforupdates subscribed");
    }
    this.KioskBluetoothTerminalInitiateUpdateCheckCallback = callback;
  }
  public OffKioskBluetoothTerminalInitiateUpdateCheck(callback: KioskBluetoothTerminalInitiateUpdateCheckCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.checkforupdates unsubscribed");
    }
	this.KioskBluetoothTerminalInitiateUpdateCheckCallback = undefined;
  }
  
  public OnKioskBluetoothInstallUpdateInitiate(callback: KioskBluetoothInstallUpdateInitiateCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.initiateinstallupdatemode subscribed");
    }
    this.KioskBluetoothInstallUpdateInitiateCallback = callback;
  }
  public OffKioskBluetoothInstallUpdateInitiate(callback: KioskBluetoothInstallUpdateInitiateCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.initiateinstallupdatemode unsubscribed");
    }
	this.KioskBluetoothInstallUpdateInitiateCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalCancelUpdate(callback: KioskBluetoothTerminalCancelUpdateCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.cancelupdateinstall subscribed");
    }
    this.KioskBluetoothTerminalCancelUpdateCallback = callback;
  }
  public OffKioskBluetoothTerminalCancelUpdate(callback: KioskBluetoothTerminalCancelUpdateCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.cancelupdateinstall unsubscribed");
    }
	this.KioskBluetoothTerminalCancelUpdateCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalInstallationStatus(callback: KioskBluetoothTerminalInstallationStatusCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.installationstatus subscribed");
    }
    this.KioskBluetoothTerminalInstallationStatusCallback = callback;
  }
  public OffKioskBluetoothTerminalInstallationStatus(callback: KioskBluetoothTerminalInstallationStatusCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.installationstatus unsubscribed");
    }
	this.KioskBluetoothTerminalInstallationStatusCallback = undefined;
  }
  
  public OnKioskBluetoothTerminalFirmwareVersionStatus(callback: KioskBluetoothTerminalFirmwareVersionStatusCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.firmwareupdateversion subscribed");
    }
    this.KioskBluetoothTerminalFirmwareVersionStatusCallback = callback;
  }
  public OffKioskBluetoothTerminalFirmwareVersionStatus(callback: KioskBluetoothTerminalFirmwareVersionStatusCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.firmwareupdateversion unsubscribed");
    }
	this.KioskBluetoothTerminalFirmwareVersionStatusCallback = undefined;
  }
  
  public OnKioskTerminalActionStateChanged(callback: KioskTerminalActionStateChangedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.terminalactionstatechanged subscribed");
    }
    this.KioskTerminalActionStateChangedCallback = callback;
  }
  public OffKioskTerminalActionStateChanged(callback: KioskTerminalActionStateChangedCallback){
    if(this.log){
      console.log("cardreaders.kiosk.bluetooth.terminalactionstatechanged unsubscribed");
    }
	this.KioskTerminalActionStateChangedCallback = undefined;
  }
  
}
/* CardReaderHub End */


/* ChannelHub Start */


/**
 * ChannelHub
 */
export class ChannelHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* ChannelHub End */


/* CustomerHub Start */

/**
 * CustomerCreated Subscription Callback
*/
export interface CustomerCreatedCallback{
  (data: Flipdish.CustomerCreatedEvent): void;
}

/**
 * CustomerUpdated Subscription Callback
*/
export interface CustomerUpdatedCallback{
  (data: Flipdish.CustomerUpdatedEvent): void;
}

/**
 * CustomerConsentUpdated Subscription Callback
*/
export interface CustomerConsentUpdatedCallback{
  (data: Flipdish.CustomerConsentUpdatedEvent): void;
}


/**
 * CustomerHub
 */
export class CustomerHub {
  private proxy: Proxy;
  private log: boolean;
  
  private CustomerCreatedCallback: CustomerCreatedCallback;
  
  private CustomerUpdatedCallback: CustomerUpdatedCallback;
  
  private CustomerConsentUpdatedCallback: CustomerConsentUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.CustomerCreatedCallback = undefined;
    
    this.CustomerUpdatedCallback = undefined;
    
    this.CustomerConsentUpdatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("customer.created", (eventData:SignalrEvent) => {
      var data:Flipdish.CustomerCreatedEvent = JSON.parse(eventData.Body);
      if(this.CustomerCreatedCallback){
        if(this.log){
          console.log("customer.created received");
          console.log(eventData.Body);
        }
        this.CustomerCreatedCallback(data);
      }
    });
      
    this.proxy.on("customer.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.CustomerUpdatedEvent = JSON.parse(eventData.Body);
      if(this.CustomerUpdatedCallback){
        if(this.log){
          console.log("customer.updated received");
          console.log(eventData.Body);
        }
        this.CustomerUpdatedCallback(data);
      }
    });
      
    this.proxy.on("customer.consent.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.CustomerConsentUpdatedEvent = JSON.parse(eventData.Body);
      if(this.CustomerConsentUpdatedCallback){
        if(this.log){
          console.log("customer.consent.updated received");
          console.log(eventData.Body);
        }
        this.CustomerConsentUpdatedCallback(data);
      }
    });
      
  }
  
  public OnCustomerCreated(callback: CustomerCreatedCallback){
    if(this.log){
      console.log("customer.created subscribed");
    }
    this.CustomerCreatedCallback = callback;
  }
  public OffCustomerCreated(callback: CustomerCreatedCallback){
    if(this.log){
      console.log("customer.created unsubscribed");
    }
	this.CustomerCreatedCallback = undefined;
  }
  
  public OnCustomerUpdated(callback: CustomerUpdatedCallback){
    if(this.log){
      console.log("customer.updated subscribed");
    }
    this.CustomerUpdatedCallback = callback;
  }
  public OffCustomerUpdated(callback: CustomerUpdatedCallback){
    if(this.log){
      console.log("customer.updated unsubscribed");
    }
	this.CustomerUpdatedCallback = undefined;
  }
  
  public OnCustomerConsentUpdated(callback: CustomerConsentUpdatedCallback){
    if(this.log){
      console.log("customer.consent.updated subscribed");
    }
    this.CustomerConsentUpdatedCallback = callback;
  }
  public OffCustomerConsentUpdated(callback: CustomerConsentUpdatedCallback){
    if(this.log){
      console.log("customer.consent.updated unsubscribed");
    }
	this.CustomerConsentUpdatedCallback = undefined;
  }
  
}
/* CustomerHub End */


/* HydraHub Start */

/**
 * HydraAssigned Subscription Callback
*/
export interface HydraAssignedCallback{
  (data: Flipdish.HydraAssignedEvent): void;
}

/**
 * HydraRequestReset Subscription Callback
*/
export interface HydraRequestResetCallback{
  (data: Flipdish.HydraRequestResetEvent): void;
}

/**
 * HydraSettingChanged Subscription Callback
*/
export interface HydraSettingChangedCallback{
  (data: Flipdish.HydraSettingChangedEvent): void;
}

/**
 * HydraConnectionStatusChanged Subscription Callback
*/
export interface HydraConnectionStatusChangedCallback{
  (data: Flipdish.HydraConnectionStatusChangedEvent): void;
}

/**
 * HydraUnAssigned Subscription Callback
*/
export interface HydraUnAssignedCallback{
  (data: Flipdish.HydraUnAssignedEvent): void;
}

/**
 * HydraStoreAssigned Subscription Callback
*/
export interface HydraStoreAssignedCallback{
  (data: Flipdish.HydraStoreAssignedEvent): void;
}

/**
 * HydraStoreUnassigned Subscription Callback
*/
export interface HydraStoreUnassignedCallback{
  (data: Flipdish.HydraStoreUnassignedEvent): void;
}


/**
 * HydraHub
 */
export class HydraHub {
  private proxy: Proxy;
  private log: boolean;
  
  private HydraAssignedCallback: HydraAssignedCallback;
  
  private HydraRequestResetCallback: HydraRequestResetCallback;
  
  private HydraSettingChangedCallback: HydraSettingChangedCallback;
  
  private HydraConnectionStatusChangedCallback: HydraConnectionStatusChangedCallback;
  
  private HydraUnAssignedCallback: HydraUnAssignedCallback;
  
  private HydraStoreAssignedCallback: HydraStoreAssignedCallback;
  
  private HydraStoreUnassignedCallback: HydraStoreUnassignedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.HydraAssignedCallback = undefined;
    
    this.HydraRequestResetCallback = undefined;
    
    this.HydraSettingChangedCallback = undefined;
    
    this.HydraConnectionStatusChangedCallback = undefined;
    
    this.HydraUnAssignedCallback = undefined;
    
    this.HydraStoreAssignedCallback = undefined;
    
    this.HydraStoreUnassignedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("hydra.assigned", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraAssignedEvent = JSON.parse(eventData.Body);
      if(this.HydraAssignedCallback){
        if(this.log){
          console.log("hydra.assigned received");
          console.log(eventData.Body);
        }
        this.HydraAssignedCallback(data);
      }
    });
      
    this.proxy.on("hydra.request_reset", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraRequestResetEvent = JSON.parse(eventData.Body);
      if(this.HydraRequestResetCallback){
        if(this.log){
          console.log("hydra.request_reset received");
          console.log(eventData.Body);
        }
        this.HydraRequestResetCallback(data);
      }
    });
      
    this.proxy.on("hydra.setting_changed", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraSettingChangedEvent = JSON.parse(eventData.Body);
      if(this.HydraSettingChangedCallback){
        if(this.log){
          console.log("hydra.setting_changed received");
          console.log(eventData.Body);
        }
        this.HydraSettingChangedCallback(data);
      }
    });
      
    this.proxy.on("hydra.conection_status_changed", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraConnectionStatusChangedEvent = JSON.parse(eventData.Body);
      if(this.HydraConnectionStatusChangedCallback){
        if(this.log){
          console.log("hydra.conection_status_changed received");
          console.log(eventData.Body);
        }
        this.HydraConnectionStatusChangedCallback(data);
      }
    });
      
    this.proxy.on("hydra.unassigned", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraUnAssignedEvent = JSON.parse(eventData.Body);
      if(this.HydraUnAssignedCallback){
        if(this.log){
          console.log("hydra.unassigned received");
          console.log(eventData.Body);
        }
        this.HydraUnAssignedCallback(data);
      }
    });
      
    this.proxy.on("hydra.store.assigned", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraStoreAssignedEvent = JSON.parse(eventData.Body);
      if(this.HydraStoreAssignedCallback){
        if(this.log){
          console.log("hydra.store.assigned received");
          console.log(eventData.Body);
        }
        this.HydraStoreAssignedCallback(data);
      }
    });
      
    this.proxy.on("hydra.store.unassigned", (eventData:SignalrEvent) => {
      var data:Flipdish.HydraStoreUnassignedEvent = JSON.parse(eventData.Body);
      if(this.HydraStoreUnassignedCallback){
        if(this.log){
          console.log("hydra.store.unassigned received");
          console.log(eventData.Body);
        }
        this.HydraStoreUnassignedCallback(data);
      }
    });
      
  }
  
  public OnHydraAssigned(callback: HydraAssignedCallback){
    if(this.log){
      console.log("hydra.assigned subscribed");
    }
    this.HydraAssignedCallback = callback;
  }
  public OffHydraAssigned(callback: HydraAssignedCallback){
    if(this.log){
      console.log("hydra.assigned unsubscribed");
    }
	this.HydraAssignedCallback = undefined;
  }
  
  public OnHydraRequestReset(callback: HydraRequestResetCallback){
    if(this.log){
      console.log("hydra.request_reset subscribed");
    }
    this.HydraRequestResetCallback = callback;
  }
  public OffHydraRequestReset(callback: HydraRequestResetCallback){
    if(this.log){
      console.log("hydra.request_reset unsubscribed");
    }
	this.HydraRequestResetCallback = undefined;
  }
  
  public OnHydraSettingChanged(callback: HydraSettingChangedCallback){
    if(this.log){
      console.log("hydra.setting_changed subscribed");
    }
    this.HydraSettingChangedCallback = callback;
  }
  public OffHydraSettingChanged(callback: HydraSettingChangedCallback){
    if(this.log){
      console.log("hydra.setting_changed unsubscribed");
    }
	this.HydraSettingChangedCallback = undefined;
  }
  
  public OnHydraConnectionStatusChanged(callback: HydraConnectionStatusChangedCallback){
    if(this.log){
      console.log("hydra.conection_status_changed subscribed");
    }
    this.HydraConnectionStatusChangedCallback = callback;
  }
  public OffHydraConnectionStatusChanged(callback: HydraConnectionStatusChangedCallback){
    if(this.log){
      console.log("hydra.conection_status_changed unsubscribed");
    }
	this.HydraConnectionStatusChangedCallback = undefined;
  }
  
  public OnHydraUnAssigned(callback: HydraUnAssignedCallback){
    if(this.log){
      console.log("hydra.unassigned subscribed");
    }
    this.HydraUnAssignedCallback = callback;
  }
  public OffHydraUnAssigned(callback: HydraUnAssignedCallback){
    if(this.log){
      console.log("hydra.unassigned unsubscribed");
    }
	this.HydraUnAssignedCallback = undefined;
  }
  
  public OnHydraStoreAssigned(callback: HydraStoreAssignedCallback){
    if(this.log){
      console.log("hydra.store.assigned subscribed");
    }
    this.HydraStoreAssignedCallback = callback;
  }
  public OffHydraStoreAssigned(callback: HydraStoreAssignedCallback){
    if(this.log){
      console.log("hydra.store.assigned unsubscribed");
    }
	this.HydraStoreAssignedCallback = undefined;
  }
  
  public OnHydraStoreUnassigned(callback: HydraStoreUnassignedCallback){
    if(this.log){
      console.log("hydra.store.unassigned subscribed");
    }
    this.HydraStoreUnassignedCallback = callback;
  }
  public OffHydraStoreUnassigned(callback: HydraStoreUnassignedCallback){
    if(this.log){
      console.log("hydra.store.unassigned unsubscribed");
    }
	this.HydraStoreUnassignedCallback = undefined;
  }
  
}
/* HydraHub End */


/* MenuCheckpointHub Start */


/**
 * MenuCheckpointHub
 */
export class MenuCheckpointHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* MenuCheckpointHub End */


/* MenuHub Start */


/**
 * MenuHub
 */
export class MenuHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* MenuHub End */


/* OrderHub Start */

/**
 * OrderCreated Subscription Callback
*/
export interface OrderCreatedCallback{
  (data: Flipdish.OrderCreatedEvent): void;
}

/**
 * OrderRejected Subscription Callback
*/
export interface OrderRejectedCallback{
  (data: Flipdish.OrderRejectedEvent): void;
}

/**
 * OrderAccepted Subscription Callback
*/
export interface OrderAcceptedCallback{
  (data: Flipdish.OrderAcceptedEvent): void;
}

/**
 * OrderRefunded Subscription Callback
*/
export interface OrderRefundedCallback{
  (data: Flipdish.OrderRefundedEvent): void;
}


/**
 * OrderHub
 */
export class OrderHub {
  private proxy: Proxy;
  private log: boolean;
  
  private OrderCreatedCallback: OrderCreatedCallback;
  
  private OrderRejectedCallback: OrderRejectedCallback;
  
  private OrderAcceptedCallback: OrderAcceptedCallback;
  
  private OrderRefundedCallback: OrderRefundedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.OrderCreatedCallback = undefined;
    
    this.OrderRejectedCallback = undefined;
    
    this.OrderAcceptedCallback = undefined;
    
    this.OrderRefundedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("order.created", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderCreatedEvent = JSON.parse(eventData.Body);
      if(this.OrderCreatedCallback){
        if(this.log){
          console.log("order.created received");
          console.log(eventData.Body);
        }
        this.OrderCreatedCallback(data);
      }
    });
      
    this.proxy.on("order.rejected", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderRejectedEvent = JSON.parse(eventData.Body);
      if(this.OrderRejectedCallback){
        if(this.log){
          console.log("order.rejected received");
          console.log(eventData.Body);
        }
        this.OrderRejectedCallback(data);
      }
    });
      
    this.proxy.on("order.accepted", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderAcceptedEvent = JSON.parse(eventData.Body);
      if(this.OrderAcceptedCallback){
        if(this.log){
          console.log("order.accepted received");
          console.log(eventData.Body);
        }
        this.OrderAcceptedCallback(data);
      }
    });
      
    this.proxy.on("order.refunded", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderRefundedEvent = JSON.parse(eventData.Body);
      if(this.OrderRefundedCallback){
        if(this.log){
          console.log("order.refunded received");
          console.log(eventData.Body);
        }
        this.OrderRefundedCallback(data);
      }
    });
      
  }
  
  public OnOrderCreated(callback: OrderCreatedCallback){
    if(this.log){
      console.log("order.created subscribed");
    }
    this.OrderCreatedCallback = callback;
  }
  public OffOrderCreated(callback: OrderCreatedCallback){
    if(this.log){
      console.log("order.created unsubscribed");
    }
	this.OrderCreatedCallback = undefined;
  }
  
  public OnOrderRejected(callback: OrderRejectedCallback){
    if(this.log){
      console.log("order.rejected subscribed");
    }
    this.OrderRejectedCallback = callback;
  }
  public OffOrderRejected(callback: OrderRejectedCallback){
    if(this.log){
      console.log("order.rejected unsubscribed");
    }
	this.OrderRejectedCallback = undefined;
  }
  
  public OnOrderAccepted(callback: OrderAcceptedCallback){
    if(this.log){
      console.log("order.accepted subscribed");
    }
    this.OrderAcceptedCallback = callback;
  }
  public OffOrderAccepted(callback: OrderAcceptedCallback){
    if(this.log){
      console.log("order.accepted unsubscribed");
    }
	this.OrderAcceptedCallback = undefined;
  }
  
  public OnOrderRefunded(callback: OrderRefundedCallback){
    if(this.log){
      console.log("order.refunded subscribed");
    }
    this.OrderRefundedCallback = callback;
  }
  public OffOrderRefunded(callback: OrderRefundedCallback){
    if(this.log){
      console.log("order.refunded unsubscribed");
    }
	this.OrderRefundedCallback = undefined;
  }
  
}
/* OrderHub End */


/* PhoneCallHub Start */


/**
 * PhoneCallHub
 */
export class PhoneCallHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* PhoneCallHub End */


/* PrinterHub Start */


/**
 * PrinterHub
 */
export class PrinterHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* PrinterHub End */


/* StoreGroupHub Start */

/**
 * StoreGroupCreated Subscription Callback
*/
export interface StoreGroupCreatedCallback{
  (data: Flipdish.StoreGroupCreatedEvent): void;
}

/**
 * StoreGroupUpdated Subscription Callback
*/
export interface StoreGroupUpdatedCallback{
  (data: Flipdish.StoreGroupUpdatedEvent): void;
}

/**
 * StoreGroupDeleted Subscription Callback
*/
export interface StoreGroupDeletedCallback{
  (data: Flipdish.StoreGroupDeletedEvent): void;
}


/**
 * StoreGroupHub
 */
export class StoreGroupHub {
  private proxy: Proxy;
  private log: boolean;
  
  private StoreGroupCreatedCallback: StoreGroupCreatedCallback;
  
  private StoreGroupUpdatedCallback: StoreGroupUpdatedCallback;
  
  private StoreGroupDeletedCallback: StoreGroupDeletedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.StoreGroupCreatedCallback = undefined;
    
    this.StoreGroupUpdatedCallback = undefined;
    
    this.StoreGroupDeletedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("store_group.created", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupCreatedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupCreatedCallback){
        if(this.log){
          console.log("store_group.created received");
          console.log(eventData.Body);
        }
        this.StoreGroupCreatedCallback(data);
      }
    });
      
    this.proxy.on("store_group.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupUpdatedCallback){
        if(this.log){
          console.log("store_group.updated received");
          console.log(eventData.Body);
        }
        this.StoreGroupUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store_group.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupDeletedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupDeletedCallback){
        if(this.log){
          console.log("store_group.deleted received");
          console.log(eventData.Body);
        }
        this.StoreGroupDeletedCallback(data);
      }
    });
      
  }
  
  public OnStoreGroupCreated(callback: StoreGroupCreatedCallback){
    if(this.log){
      console.log("store_group.created subscribed");
    }
    this.StoreGroupCreatedCallback = callback;
  }
  public OffStoreGroupCreated(callback: StoreGroupCreatedCallback){
    if(this.log){
      console.log("store_group.created unsubscribed");
    }
	this.StoreGroupCreatedCallback = undefined;
  }
  
  public OnStoreGroupUpdated(callback: StoreGroupUpdatedCallback){
    if(this.log){
      console.log("store_group.updated subscribed");
    }
    this.StoreGroupUpdatedCallback = callback;
  }
  public OffStoreGroupUpdated(callback: StoreGroupUpdatedCallback){
    if(this.log){
      console.log("store_group.updated unsubscribed");
    }
	this.StoreGroupUpdatedCallback = undefined;
  }
  
  public OnStoreGroupDeleted(callback: StoreGroupDeletedCallback){
    if(this.log){
      console.log("store_group.deleted subscribed");
    }
    this.StoreGroupDeletedCallback = callback;
  }
  public OffStoreGroupDeleted(callback: StoreGroupDeletedCallback){
    if(this.log){
      console.log("store_group.deleted unsubscribed");
    }
	this.StoreGroupDeletedCallback = undefined;
  }
  
}
/* StoreGroupHub End */


/* StoreHub Start */

/**
 * StoreCreated Subscription Callback
*/
export interface StoreCreatedCallback{
  (data: Flipdish.StoreCreatedEvent): void;
}

/**
 * StoreUpdated Subscription Callback
*/
export interface StoreUpdatedCallback{
  (data: Flipdish.StoreUpdatedEvent): void;
}

/**
 * StoreArchived Subscription Callback
*/
export interface StoreArchivedCallback{
  (data: Flipdish.StoreArchivedEvent): void;
}

/**
 * StoreUnarchived Subscription Callback
*/
export interface StoreUnarchivedCallback{
  (data: Flipdish.StoreUnarchivedEvent): void;
}

/**
 * StorePublished Subscription Callback
*/
export interface StorePublishedCallback{
  (data: Flipdish.StorePublishedEvent): void;
}

/**
 * StoreUnpublished Subscription Callback
*/
export interface StoreUnpublishedCallback{
  (data: Flipdish.StoreUnpublishedEvent): void;
}

/**
 * StoreDeleted Subscription Callback
*/
export interface StoreDeletedCallback{
  (data: Flipdish.StoreDeletedEvent): void;
}

/**
 * StoreAddressUpdated Subscription Callback
*/
export interface StoreAddressUpdatedCallback{
  (data: Flipdish.StoreAddressUpdatedEvent): void;
}

/**
 * StoreOpeningHoursUpdated Subscription Callback
*/
export interface StoreOpeningHoursUpdatedCallback{
  (data: Flipdish.StoreOpeningHoursUpdatedEvent): void;
}

/**
 * StoreMenuAssigned Subscription Callback
*/
export interface StoreMenuAssignedCallback{
  (data: Flipdish.StoreMenuAssignedEvent): void;
}

/**
 * DeliveryZoneCreated Subscription Callback
*/
export interface DeliveryZoneCreatedCallback{
  (data: Flipdish.DeliveryZoneCreatedEvent): void;
}

/**
 * DeliveryZoneUpdated Subscription Callback
*/
export interface DeliveryZoneUpdatedCallback{
  (data: Flipdish.DeliveryZoneUpdatedEvent): void;
}

/**
 * DeliveryZoneDeleted Subscription Callback
*/
export interface DeliveryZoneDeletedCallback{
  (data: Flipdish.DeliveryZoneDeletedEvent): void;
}

/**
 * StoreGroupCreated Subscription Callback
*/
export interface StoreGroupCreatedCallback{
  (data: Flipdish.StoreGroupCreatedEvent): void;
}

/**
 * StoreGroupUpdated Subscription Callback
*/
export interface StoreGroupUpdatedCallback{
  (data: Flipdish.StoreGroupUpdatedEvent): void;
}

/**
 * StoreGroupDeleted Subscription Callback
*/
export interface StoreGroupDeletedCallback{
  (data: Flipdish.StoreGroupDeletedEvent): void;
}

/**
 * StoreBusinessHoursOverrideCreated Subscription Callback
*/
export interface StoreBusinessHoursOverrideCreatedCallback{
  (data: Flipdish.StoreBusinessHoursOverrideCreatedEvent): void;
}

/**
 * StoreBusinessHoursOverrideDeleted Subscription Callback
*/
export interface StoreBusinessHoursOverrideDeletedCallback{
  (data: Flipdish.StoreBusinessHoursOverrideDeletedEvent): void;
}

/**
 * StorePreOrderConfigUpdated Subscription Callback
*/
export interface StorePreOrderConfigUpdatedCallback{
  (data: Flipdish.StorePreOrderConfigUpdatedEvent): void;
}

/**
 * StoreLogoCreated Subscription Callback
*/
export interface StoreLogoCreatedCallback{
  (data: Flipdish.StoreLogoCreatedEvent): void;
}

/**
 * StoreLogoUpdated Subscription Callback
*/
export interface StoreLogoUpdatedCallback{
  (data: Flipdish.StoreLogoUpdatedEvent): void;
}

/**
 * StoreLogoDeleted Subscription Callback
*/
export interface StoreLogoDeletedCallback{
  (data: Flipdish.StoreLogoDeletedEvent): void;
}

/**
 * StoreKioskSettingUpdated Subscription Callback
*/
export interface StoreKioskSettingUpdatedCallback{
  (data: Flipdish.StoreKioskSettingUpdatedEvent): void;
}

/**
 * StoreFeeConfigUpdated Subscription Callback
*/
export interface StoreFeeConfigUpdatedCallback{
  (data: Flipdish.StoreFeeConfigUpdatedEvent): void;
}


/**
 * StoreHub
 */
export class StoreHub {
  private proxy: Proxy;
  private log: boolean;
  
  private StoreCreatedCallback: StoreCreatedCallback;
  
  private StoreUpdatedCallback: StoreUpdatedCallback;
  
  private StoreArchivedCallback: StoreArchivedCallback;
  
  private StoreUnarchivedCallback: StoreUnarchivedCallback;
  
  private StorePublishedCallback: StorePublishedCallback;
  
  private StoreUnpublishedCallback: StoreUnpublishedCallback;
  
  private StoreDeletedCallback: StoreDeletedCallback;
  
  private StoreAddressUpdatedCallback: StoreAddressUpdatedCallback;
  
  private StoreOpeningHoursUpdatedCallback: StoreOpeningHoursUpdatedCallback;
  
  private StoreMenuAssignedCallback: StoreMenuAssignedCallback;
  
  private DeliveryZoneCreatedCallback: DeliveryZoneCreatedCallback;
  
  private DeliveryZoneUpdatedCallback: DeliveryZoneUpdatedCallback;
  
  private DeliveryZoneDeletedCallback: DeliveryZoneDeletedCallback;
  
  private StoreGroupCreatedCallback: StoreGroupCreatedCallback;
  
  private StoreGroupUpdatedCallback: StoreGroupUpdatedCallback;
  
  private StoreGroupDeletedCallback: StoreGroupDeletedCallback;
  
  private StoreBusinessHoursOverrideCreatedCallback: StoreBusinessHoursOverrideCreatedCallback;
  
  private StoreBusinessHoursOverrideDeletedCallback: StoreBusinessHoursOverrideDeletedCallback;
  
  private StorePreOrderConfigUpdatedCallback: StorePreOrderConfigUpdatedCallback;
  
  private StoreLogoCreatedCallback: StoreLogoCreatedCallback;
  
  private StoreLogoUpdatedCallback: StoreLogoUpdatedCallback;
  
  private StoreLogoDeletedCallback: StoreLogoDeletedCallback;
  
  private StoreKioskSettingUpdatedCallback: StoreKioskSettingUpdatedCallback;
  
  private StoreFeeConfigUpdatedCallback: StoreFeeConfigUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.StoreCreatedCallback = undefined;
    
    this.StoreUpdatedCallback = undefined;
    
    this.StoreArchivedCallback = undefined;
    
    this.StoreUnarchivedCallback = undefined;
    
    this.StorePublishedCallback = undefined;
    
    this.StoreUnpublishedCallback = undefined;
    
    this.StoreDeletedCallback = undefined;
    
    this.StoreAddressUpdatedCallback = undefined;
    
    this.StoreOpeningHoursUpdatedCallback = undefined;
    
    this.StoreMenuAssignedCallback = undefined;
    
    this.DeliveryZoneCreatedCallback = undefined;
    
    this.DeliveryZoneUpdatedCallback = undefined;
    
    this.DeliveryZoneDeletedCallback = undefined;
    
    this.StoreGroupCreatedCallback = undefined;
    
    this.StoreGroupUpdatedCallback = undefined;
    
    this.StoreGroupDeletedCallback = undefined;
    
    this.StoreBusinessHoursOverrideCreatedCallback = undefined;
    
    this.StoreBusinessHoursOverrideDeletedCallback = undefined;
    
    this.StorePreOrderConfigUpdatedCallback = undefined;
    
    this.StoreLogoCreatedCallback = undefined;
    
    this.StoreLogoUpdatedCallback = undefined;
    
    this.StoreLogoDeletedCallback = undefined;
    
    this.StoreKioskSettingUpdatedCallback = undefined;
    
    this.StoreFeeConfigUpdatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("store.created", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreCreatedEvent = JSON.parse(eventData.Body);
      if(this.StoreCreatedCallback){
        if(this.log){
          console.log("store.created received");
          console.log(eventData.Body);
        }
        this.StoreCreatedCallback(data);
      }
    });
      
    this.proxy.on("store.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreUpdatedCallback){
        if(this.log){
          console.log("store.updated received");
          console.log(eventData.Body);
        }
        this.StoreUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.archived", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreArchivedEvent = JSON.parse(eventData.Body);
      if(this.StoreArchivedCallback){
        if(this.log){
          console.log("store.archived received");
          console.log(eventData.Body);
        }
        this.StoreArchivedCallback(data);
      }
    });
      
    this.proxy.on("store.unarchived", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreUnarchivedEvent = JSON.parse(eventData.Body);
      if(this.StoreUnarchivedCallback){
        if(this.log){
          console.log("store.unarchived received");
          console.log(eventData.Body);
        }
        this.StoreUnarchivedCallback(data);
      }
    });
      
    this.proxy.on("store.published", (eventData:SignalrEvent) => {
      var data:Flipdish.StorePublishedEvent = JSON.parse(eventData.Body);
      if(this.StorePublishedCallback){
        if(this.log){
          console.log("store.published received");
          console.log(eventData.Body);
        }
        this.StorePublishedCallback(data);
      }
    });
      
    this.proxy.on("store.unpublished", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreUnpublishedEvent = JSON.parse(eventData.Body);
      if(this.StoreUnpublishedCallback){
        if(this.log){
          console.log("store.unpublished received");
          console.log(eventData.Body);
        }
        this.StoreUnpublishedCallback(data);
      }
    });
      
    this.proxy.on("store.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreDeletedEvent = JSON.parse(eventData.Body);
      if(this.StoreDeletedCallback){
        if(this.log){
          console.log("store.deleted received");
          console.log(eventData.Body);
        }
        this.StoreDeletedCallback(data);
      }
    });
      
    this.proxy.on("store.address.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreAddressUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreAddressUpdatedCallback){
        if(this.log){
          console.log("store.address.updated received");
          console.log(eventData.Body);
        }
        this.StoreAddressUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.opening_hours.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreOpeningHoursUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreOpeningHoursUpdatedCallback){
        if(this.log){
          console.log("store.opening_hours.updated received");
          console.log(eventData.Body);
        }
        this.StoreOpeningHoursUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.menu.assigned", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreMenuAssignedEvent = JSON.parse(eventData.Body);
      if(this.StoreMenuAssignedCallback){
        if(this.log){
          console.log("store.menu.assigned received");
          console.log(eventData.Body);
        }
        this.StoreMenuAssignedCallback(data);
      }
    });
      
    this.proxy.on("store.delivery_zone.created", (eventData:SignalrEvent) => {
      var data:Flipdish.DeliveryZoneCreatedEvent = JSON.parse(eventData.Body);
      if(this.DeliveryZoneCreatedCallback){
        if(this.log){
          console.log("store.delivery_zone.created received");
          console.log(eventData.Body);
        }
        this.DeliveryZoneCreatedCallback(data);
      }
    });
      
    this.proxy.on("store.delivery_zone.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.DeliveryZoneUpdatedEvent = JSON.parse(eventData.Body);
      if(this.DeliveryZoneUpdatedCallback){
        if(this.log){
          console.log("store.delivery_zone.updated received");
          console.log(eventData.Body);
        }
        this.DeliveryZoneUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.delivery_zone.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.DeliveryZoneDeletedEvent = JSON.parse(eventData.Body);
      if(this.DeliveryZoneDeletedCallback){
        if(this.log){
          console.log("store.delivery_zone.deleted received");
          console.log(eventData.Body);
        }
        this.DeliveryZoneDeletedCallback(data);
      }
    });
      
    this.proxy.on("store_group.created", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupCreatedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupCreatedCallback){
        if(this.log){
          console.log("store_group.created received");
          console.log(eventData.Body);
        }
        this.StoreGroupCreatedCallback(data);
      }
    });
      
    this.proxy.on("store_group.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupUpdatedCallback){
        if(this.log){
          console.log("store_group.updated received");
          console.log(eventData.Body);
        }
        this.StoreGroupUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store_group.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreGroupDeletedEvent = JSON.parse(eventData.Body);
      if(this.StoreGroupDeletedCallback){
        if(this.log){
          console.log("store_group.deleted received");
          console.log(eventData.Body);
        }
        this.StoreGroupDeletedCallback(data);
      }
    });
      
    this.proxy.on("store.business_hours_override.created", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreBusinessHoursOverrideCreatedEvent = JSON.parse(eventData.Body);
      if(this.StoreBusinessHoursOverrideCreatedCallback){
        if(this.log){
          console.log("store.business_hours_override.created received");
          console.log(eventData.Body);
        }
        this.StoreBusinessHoursOverrideCreatedCallback(data);
      }
    });
      
    this.proxy.on("store.business_hours_override.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreBusinessHoursOverrideDeletedEvent = JSON.parse(eventData.Body);
      if(this.StoreBusinessHoursOverrideDeletedCallback){
        if(this.log){
          console.log("store.business_hours_override.deleted received");
          console.log(eventData.Body);
        }
        this.StoreBusinessHoursOverrideDeletedCallback(data);
      }
    });
      
    this.proxy.on("store.preorder_config.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StorePreOrderConfigUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StorePreOrderConfigUpdatedCallback){
        if(this.log){
          console.log("store.preorder_config.updated received");
          console.log(eventData.Body);
        }
        this.StorePreOrderConfigUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.logo.created", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreLogoCreatedEvent = JSON.parse(eventData.Body);
      if(this.StoreLogoCreatedCallback){
        if(this.log){
          console.log("store.logo.created received");
          console.log(eventData.Body);
        }
        this.StoreLogoCreatedCallback(data);
      }
    });
      
    this.proxy.on("store.logo.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreLogoUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreLogoUpdatedCallback){
        if(this.log){
          console.log("store.logo.updated received");
          console.log(eventData.Body);
        }
        this.StoreLogoUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.logo.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreLogoDeletedEvent = JSON.parse(eventData.Body);
      if(this.StoreLogoDeletedCallback){
        if(this.log){
          console.log("store.logo.deleted received");
          console.log(eventData.Body);
        }
        this.StoreLogoDeletedCallback(data);
      }
    });
      
    this.proxy.on("store.kiosk_setting.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreKioskSettingUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreKioskSettingUpdatedCallback){
        if(this.log){
          console.log("store.kiosk_setting.updated received");
          console.log(eventData.Body);
        }
        this.StoreKioskSettingUpdatedCallback(data);
      }
    });
      
    this.proxy.on("store.fee_config.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.StoreFeeConfigUpdatedEvent = JSON.parse(eventData.Body);
      if(this.StoreFeeConfigUpdatedCallback){
        if(this.log){
          console.log("store.fee_config.updated received");
          console.log(eventData.Body);
        }
        this.StoreFeeConfigUpdatedCallback(data);
      }
    });
      
  }
  
  public OnStoreCreated(callback: StoreCreatedCallback){
    if(this.log){
      console.log("store.created subscribed");
    }
    this.StoreCreatedCallback = callback;
  }
  public OffStoreCreated(callback: StoreCreatedCallback){
    if(this.log){
      console.log("store.created unsubscribed");
    }
	this.StoreCreatedCallback = undefined;
  }
  
  public OnStoreUpdated(callback: StoreUpdatedCallback){
    if(this.log){
      console.log("store.updated subscribed");
    }
    this.StoreUpdatedCallback = callback;
  }
  public OffStoreUpdated(callback: StoreUpdatedCallback){
    if(this.log){
      console.log("store.updated unsubscribed");
    }
	this.StoreUpdatedCallback = undefined;
  }
  
  public OnStoreArchived(callback: StoreArchivedCallback){
    if(this.log){
      console.log("store.archived subscribed");
    }
    this.StoreArchivedCallback = callback;
  }
  public OffStoreArchived(callback: StoreArchivedCallback){
    if(this.log){
      console.log("store.archived unsubscribed");
    }
	this.StoreArchivedCallback = undefined;
  }
  
  public OnStoreUnarchived(callback: StoreUnarchivedCallback){
    if(this.log){
      console.log("store.unarchived subscribed");
    }
    this.StoreUnarchivedCallback = callback;
  }
  public OffStoreUnarchived(callback: StoreUnarchivedCallback){
    if(this.log){
      console.log("store.unarchived unsubscribed");
    }
	this.StoreUnarchivedCallback = undefined;
  }
  
  public OnStorePublished(callback: StorePublishedCallback){
    if(this.log){
      console.log("store.published subscribed");
    }
    this.StorePublishedCallback = callback;
  }
  public OffStorePublished(callback: StorePublishedCallback){
    if(this.log){
      console.log("store.published unsubscribed");
    }
	this.StorePublishedCallback = undefined;
  }
  
  public OnStoreUnpublished(callback: StoreUnpublishedCallback){
    if(this.log){
      console.log("store.unpublished subscribed");
    }
    this.StoreUnpublishedCallback = callback;
  }
  public OffStoreUnpublished(callback: StoreUnpublishedCallback){
    if(this.log){
      console.log("store.unpublished unsubscribed");
    }
	this.StoreUnpublishedCallback = undefined;
  }
  
  public OnStoreDeleted(callback: StoreDeletedCallback){
    if(this.log){
      console.log("store.deleted subscribed");
    }
    this.StoreDeletedCallback = callback;
  }
  public OffStoreDeleted(callback: StoreDeletedCallback){
    if(this.log){
      console.log("store.deleted unsubscribed");
    }
	this.StoreDeletedCallback = undefined;
  }
  
  public OnStoreAddressUpdated(callback: StoreAddressUpdatedCallback){
    if(this.log){
      console.log("store.address.updated subscribed");
    }
    this.StoreAddressUpdatedCallback = callback;
  }
  public OffStoreAddressUpdated(callback: StoreAddressUpdatedCallback){
    if(this.log){
      console.log("store.address.updated unsubscribed");
    }
	this.StoreAddressUpdatedCallback = undefined;
  }
  
  public OnStoreOpeningHoursUpdated(callback: StoreOpeningHoursUpdatedCallback){
    if(this.log){
      console.log("store.opening_hours.updated subscribed");
    }
    this.StoreOpeningHoursUpdatedCallback = callback;
  }
  public OffStoreOpeningHoursUpdated(callback: StoreOpeningHoursUpdatedCallback){
    if(this.log){
      console.log("store.opening_hours.updated unsubscribed");
    }
	this.StoreOpeningHoursUpdatedCallback = undefined;
  }
  
  public OnStoreMenuAssigned(callback: StoreMenuAssignedCallback){
    if(this.log){
      console.log("store.menu.assigned subscribed");
    }
    this.StoreMenuAssignedCallback = callback;
  }
  public OffStoreMenuAssigned(callback: StoreMenuAssignedCallback){
    if(this.log){
      console.log("store.menu.assigned unsubscribed");
    }
	this.StoreMenuAssignedCallback = undefined;
  }
  
  public OnDeliveryZoneCreated(callback: DeliveryZoneCreatedCallback){
    if(this.log){
      console.log("store.delivery_zone.created subscribed");
    }
    this.DeliveryZoneCreatedCallback = callback;
  }
  public OffDeliveryZoneCreated(callback: DeliveryZoneCreatedCallback){
    if(this.log){
      console.log("store.delivery_zone.created unsubscribed");
    }
	this.DeliveryZoneCreatedCallback = undefined;
  }
  
  public OnDeliveryZoneUpdated(callback: DeliveryZoneUpdatedCallback){
    if(this.log){
      console.log("store.delivery_zone.updated subscribed");
    }
    this.DeliveryZoneUpdatedCallback = callback;
  }
  public OffDeliveryZoneUpdated(callback: DeliveryZoneUpdatedCallback){
    if(this.log){
      console.log("store.delivery_zone.updated unsubscribed");
    }
	this.DeliveryZoneUpdatedCallback = undefined;
  }
  
  public OnDeliveryZoneDeleted(callback: DeliveryZoneDeletedCallback){
    if(this.log){
      console.log("store.delivery_zone.deleted subscribed");
    }
    this.DeliveryZoneDeletedCallback = callback;
  }
  public OffDeliveryZoneDeleted(callback: DeliveryZoneDeletedCallback){
    if(this.log){
      console.log("store.delivery_zone.deleted unsubscribed");
    }
	this.DeliveryZoneDeletedCallback = undefined;
  }
  
  public OnStoreGroupCreated(callback: StoreGroupCreatedCallback){
    if(this.log){
      console.log("store_group.created subscribed");
    }
    this.StoreGroupCreatedCallback = callback;
  }
  public OffStoreGroupCreated(callback: StoreGroupCreatedCallback){
    if(this.log){
      console.log("store_group.created unsubscribed");
    }
	this.StoreGroupCreatedCallback = undefined;
  }
  
  public OnStoreGroupUpdated(callback: StoreGroupUpdatedCallback){
    if(this.log){
      console.log("store_group.updated subscribed");
    }
    this.StoreGroupUpdatedCallback = callback;
  }
  public OffStoreGroupUpdated(callback: StoreGroupUpdatedCallback){
    if(this.log){
      console.log("store_group.updated unsubscribed");
    }
	this.StoreGroupUpdatedCallback = undefined;
  }
  
  public OnStoreGroupDeleted(callback: StoreGroupDeletedCallback){
    if(this.log){
      console.log("store_group.deleted subscribed");
    }
    this.StoreGroupDeletedCallback = callback;
  }
  public OffStoreGroupDeleted(callback: StoreGroupDeletedCallback){
    if(this.log){
      console.log("store_group.deleted unsubscribed");
    }
	this.StoreGroupDeletedCallback = undefined;
  }
  
  public OnStoreBusinessHoursOverrideCreated(callback: StoreBusinessHoursOverrideCreatedCallback){
    if(this.log){
      console.log("store.business_hours_override.created subscribed");
    }
    this.StoreBusinessHoursOverrideCreatedCallback = callback;
  }
  public OffStoreBusinessHoursOverrideCreated(callback: StoreBusinessHoursOverrideCreatedCallback){
    if(this.log){
      console.log("store.business_hours_override.created unsubscribed");
    }
	this.StoreBusinessHoursOverrideCreatedCallback = undefined;
  }
  
  public OnStoreBusinessHoursOverrideDeleted(callback: StoreBusinessHoursOverrideDeletedCallback){
    if(this.log){
      console.log("store.business_hours_override.deleted subscribed");
    }
    this.StoreBusinessHoursOverrideDeletedCallback = callback;
  }
  public OffStoreBusinessHoursOverrideDeleted(callback: StoreBusinessHoursOverrideDeletedCallback){
    if(this.log){
      console.log("store.business_hours_override.deleted unsubscribed");
    }
	this.StoreBusinessHoursOverrideDeletedCallback = undefined;
  }
  
  public OnStorePreOrderConfigUpdated(callback: StorePreOrderConfigUpdatedCallback){
    if(this.log){
      console.log("store.preorder_config.updated subscribed");
    }
    this.StorePreOrderConfigUpdatedCallback = callback;
  }
  public OffStorePreOrderConfigUpdated(callback: StorePreOrderConfigUpdatedCallback){
    if(this.log){
      console.log("store.preorder_config.updated unsubscribed");
    }
	this.StorePreOrderConfigUpdatedCallback = undefined;
  }
  
  public OnStoreLogoCreated(callback: StoreLogoCreatedCallback){
    if(this.log){
      console.log("store.logo.created subscribed");
    }
    this.StoreLogoCreatedCallback = callback;
  }
  public OffStoreLogoCreated(callback: StoreLogoCreatedCallback){
    if(this.log){
      console.log("store.logo.created unsubscribed");
    }
	this.StoreLogoCreatedCallback = undefined;
  }
  
  public OnStoreLogoUpdated(callback: StoreLogoUpdatedCallback){
    if(this.log){
      console.log("store.logo.updated subscribed");
    }
    this.StoreLogoUpdatedCallback = callback;
  }
  public OffStoreLogoUpdated(callback: StoreLogoUpdatedCallback){
    if(this.log){
      console.log("store.logo.updated unsubscribed");
    }
	this.StoreLogoUpdatedCallback = undefined;
  }
  
  public OnStoreLogoDeleted(callback: StoreLogoDeletedCallback){
    if(this.log){
      console.log("store.logo.deleted subscribed");
    }
    this.StoreLogoDeletedCallback = callback;
  }
  public OffStoreLogoDeleted(callback: StoreLogoDeletedCallback){
    if(this.log){
      console.log("store.logo.deleted unsubscribed");
    }
	this.StoreLogoDeletedCallback = undefined;
  }
  
  public OnStoreKioskSettingUpdated(callback: StoreKioskSettingUpdatedCallback){
    if(this.log){
      console.log("store.kiosk_setting.updated subscribed");
    }
    this.StoreKioskSettingUpdatedCallback = callback;
  }
  public OffStoreKioskSettingUpdated(callback: StoreKioskSettingUpdatedCallback){
    if(this.log){
      console.log("store.kiosk_setting.updated unsubscribed");
    }
	this.StoreKioskSettingUpdatedCallback = undefined;
  }
  
  public OnStoreFeeConfigUpdated(callback: StoreFeeConfigUpdatedCallback){
    if(this.log){
      console.log("store.fee_config.updated subscribed");
    }
    this.StoreFeeConfigUpdatedCallback = callback;
  }
  public OffStoreFeeConfigUpdated(callback: StoreFeeConfigUpdatedCallback){
    if(this.log){
      console.log("store.fee_config.updated unsubscribed");
    }
	this.StoreFeeConfigUpdatedCallback = undefined;
  }
  
}
/* StoreHub End */


/* TeammateHub Start */

/**
 * TeammateInviteSent Subscription Callback
*/
export interface TeammateInviteSentCallback{
  (data: Flipdish.TeammateInviteSentEvent): void;
}

/**
 * TeammateInviteAccepted Subscription Callback
*/
export interface TeammateInviteAcceptedCallback{
  (data: Flipdish.TeammateInviteAcceptedEvent): void;
}

/**
 * TeammateUpdated Subscription Callback
*/
export interface TeammateUpdatedCallback{
  (data: Flipdish.TeammateUpdatedEvent): void;
}

/**
 * TeammateDeleted Subscription Callback
*/
export interface TeammateDeletedCallback{
  (data: Flipdish.TeammateDeletedEvent): void;
}


/**
 * TeammateHub
 */
export class TeammateHub {
  private proxy: Proxy;
  private log: boolean;
  
  private TeammateInviteSentCallback: TeammateInviteSentCallback;
  
  private TeammateInviteAcceptedCallback: TeammateInviteAcceptedCallback;
  
  private TeammateUpdatedCallback: TeammateUpdatedCallback;
  
  private TeammateDeletedCallback: TeammateDeletedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.TeammateInviteSentCallback = undefined;
    
    this.TeammateInviteAcceptedCallback = undefined;
    
    this.TeammateUpdatedCallback = undefined;
    
    this.TeammateDeletedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("teammate.invite.sent", (eventData:SignalrEvent) => {
      var data:Flipdish.TeammateInviteSentEvent = JSON.parse(eventData.Body);
      if(this.TeammateInviteSentCallback){
        if(this.log){
          console.log("teammate.invite.sent received");
          console.log(eventData.Body);
        }
        this.TeammateInviteSentCallback(data);
      }
    });
      
    this.proxy.on("teammate.invite.accepted", (eventData:SignalrEvent) => {
      var data:Flipdish.TeammateInviteAcceptedEvent = JSON.parse(eventData.Body);
      if(this.TeammateInviteAcceptedCallback){
        if(this.log){
          console.log("teammate.invite.accepted received");
          console.log(eventData.Body);
        }
        this.TeammateInviteAcceptedCallback(data);
      }
    });
      
    this.proxy.on("teammate.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.TeammateUpdatedEvent = JSON.parse(eventData.Body);
      if(this.TeammateUpdatedCallback){
        if(this.log){
          console.log("teammate.updated received");
          console.log(eventData.Body);
        }
        this.TeammateUpdatedCallback(data);
      }
    });
      
    this.proxy.on("teammate.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.TeammateDeletedEvent = JSON.parse(eventData.Body);
      if(this.TeammateDeletedCallback){
        if(this.log){
          console.log("teammate.deleted received");
          console.log(eventData.Body);
        }
        this.TeammateDeletedCallback(data);
      }
    });
      
  }
  
  public OnTeammateInviteSent(callback: TeammateInviteSentCallback){
    if(this.log){
      console.log("teammate.invite.sent subscribed");
    }
    this.TeammateInviteSentCallback = callback;
  }
  public OffTeammateInviteSent(callback: TeammateInviteSentCallback){
    if(this.log){
      console.log("teammate.invite.sent unsubscribed");
    }
	this.TeammateInviteSentCallback = undefined;
  }
  
  public OnTeammateInviteAccepted(callback: TeammateInviteAcceptedCallback){
    if(this.log){
      console.log("teammate.invite.accepted subscribed");
    }
    this.TeammateInviteAcceptedCallback = callback;
  }
  public OffTeammateInviteAccepted(callback: TeammateInviteAcceptedCallback){
    if(this.log){
      console.log("teammate.invite.accepted unsubscribed");
    }
	this.TeammateInviteAcceptedCallback = undefined;
  }
  
  public OnTeammateUpdated(callback: TeammateUpdatedCallback){
    if(this.log){
      console.log("teammate.updated subscribed");
    }
    this.TeammateUpdatedCallback = callback;
  }
  public OffTeammateUpdated(callback: TeammateUpdatedCallback){
    if(this.log){
      console.log("teammate.updated unsubscribed");
    }
	this.TeammateUpdatedCallback = undefined;
  }
  
  public OnTeammateDeleted(callback: TeammateDeletedCallback){
    if(this.log){
      console.log("teammate.deleted subscribed");
    }
    this.TeammateDeletedCallback = callback;
  }
  public OffTeammateDeleted(callback: TeammateDeletedCallback){
    if(this.log){
      console.log("teammate.deleted unsubscribed");
    }
	this.TeammateDeletedCallback = undefined;
  }
  
}
/* TeammateHub End */


/* TelephonyConfigHub Start */


/**
 * TelephonyConfigHub
 */
export class TelephonyConfigHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* TelephonyConfigHub End */


/* VoucherHub Start */

/**
 * VoucherCreated Subscription Callback
*/
export interface VoucherCreatedCallback{
  (data: Flipdish.VoucherCreatedEvent): void;
}

/**
 * VoucherDeleted Subscription Callback
*/
export interface VoucherDeletedCallback{
  (data: Flipdish.VoucherDeletedEvent): void;
}

/**
 * VoucherUpdated Subscription Callback
*/
export interface VoucherUpdatedCallback{
  (data: Flipdish.VoucherUpdatedEvent): void;
}

/**
 * VoucherApplied Subscription Callback
*/
export interface VoucherAppliedCallback{
  (data: Flipdish.VoucherAppliedEvent): void;
}


/**
 * VoucherHub
 */
export class VoucherHub {
  private proxy: Proxy;
  private log: boolean;
  
  private VoucherCreatedCallback: VoucherCreatedCallback;
  
  private VoucherDeletedCallback: VoucherDeletedCallback;
  
  private VoucherUpdatedCallback: VoucherUpdatedCallback;
  
  private VoucherAppliedCallback: VoucherAppliedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.VoucherCreatedCallback = undefined;
    
    this.VoucherDeletedCallback = undefined;
    
    this.VoucherUpdatedCallback = undefined;
    
    this.VoucherAppliedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("voucher.created", (eventData:SignalrEvent) => {
      var data:Flipdish.VoucherCreatedEvent = JSON.parse(eventData.Body);
      if(this.VoucherCreatedCallback){
        if(this.log){
          console.log("voucher.created received");
          console.log(eventData.Body);
        }
        this.VoucherCreatedCallback(data);
      }
    });
      
    this.proxy.on("voucher.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.VoucherDeletedEvent = JSON.parse(eventData.Body);
      if(this.VoucherDeletedCallback){
        if(this.log){
          console.log("voucher.deleted received");
          console.log(eventData.Body);
        }
        this.VoucherDeletedCallback(data);
      }
    });
      
    this.proxy.on("voucher.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.VoucherUpdatedEvent = JSON.parse(eventData.Body);
      if(this.VoucherUpdatedCallback){
        if(this.log){
          console.log("voucher.updated received");
          console.log(eventData.Body);
        }
        this.VoucherUpdatedCallback(data);
      }
    });
      
    this.proxy.on("voucher.applied", (eventData:SignalrEvent) => {
      var data:Flipdish.VoucherAppliedEvent = JSON.parse(eventData.Body);
      if(this.VoucherAppliedCallback){
        if(this.log){
          console.log("voucher.applied received");
          console.log(eventData.Body);
        }
        this.VoucherAppliedCallback(data);
      }
    });
      
  }
  
  public OnVoucherCreated(callback: VoucherCreatedCallback){
    if(this.log){
      console.log("voucher.created subscribed");
    }
    this.VoucherCreatedCallback = callback;
  }
  public OffVoucherCreated(callback: VoucherCreatedCallback){
    if(this.log){
      console.log("voucher.created unsubscribed");
    }
	this.VoucherCreatedCallback = undefined;
  }
  
  public OnVoucherDeleted(callback: VoucherDeletedCallback){
    if(this.log){
      console.log("voucher.deleted subscribed");
    }
    this.VoucherDeletedCallback = callback;
  }
  public OffVoucherDeleted(callback: VoucherDeletedCallback){
    if(this.log){
      console.log("voucher.deleted unsubscribed");
    }
	this.VoucherDeletedCallback = undefined;
  }
  
  public OnVoucherUpdated(callback: VoucherUpdatedCallback){
    if(this.log){
      console.log("voucher.updated subscribed");
    }
    this.VoucherUpdatedCallback = callback;
  }
  public OffVoucherUpdated(callback: VoucherUpdatedCallback){
    if(this.log){
      console.log("voucher.updated unsubscribed");
    }
	this.VoucherUpdatedCallback = undefined;
  }
  
  public OnVoucherApplied(callback: VoucherAppliedCallback){
    if(this.log){
      console.log("voucher.applied subscribed");
    }
    this.VoucherAppliedCallback = callback;
  }
  public OffVoucherApplied(callback: VoucherAppliedCallback){
    if(this.log){
      console.log("voucher.applied unsubscribed");
    }
	this.VoucherAppliedCallback = undefined;
  }
  
}
/* VoucherHub End */


/* WebhookHub Start */


/**
 * WebhookHub
 */
export class WebhookHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* WebhookHub End */


/* WebsiteHub Start */


/**
 * WebsiteHub
 */
export class WebsiteHub {
  private proxy: Proxy;
  private log: boolean;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.proxy = proxy;
    this.log = log;
    
  }
  
}
/* WebsiteHub End */


