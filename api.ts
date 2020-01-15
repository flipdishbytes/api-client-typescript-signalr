import { Connection, hubConnection, Proxy } from "@flipdish/signalr-no-jquery";
import * as Flipdish from "@flipdish/api-client-typescript";

let defaultBasePath = "https://api.flipdish.co";

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
  
  public AppHub: AppHub;
  
  public BankAccountHub: BankAccountHub;
  
  public HydraHub: HydraHub;
  
  public MenuCheckpointHub: MenuCheckpointHub;
  
  public StoreGroupHub: StoreGroupHub;
  
  public TeammateHub: TeammateHub;
  
  public VoucherHub: VoucherHub;
  
  public WebsiteHub: WebsiteHub;
  
  public AnalyticsHub: AnalyticsHub;
  
  public CampaignHub: CampaignHub;
  
  public CustomerHub: CustomerHub;
  
  public MenuHub: MenuHub;
  
  public OrderHub: OrderHub;
  
  public PhoneCallHub: PhoneCallHub;
  
  public PrinterHub: PrinterHub;
  
  public StoreHub: StoreHub;
  
  public WebhookHub: WebhookHub;
  
  public constructor(signalRConfiguration?:SignalRConfiguration){
    this.signalRConfiguration = signalRConfiguration;

    if(!SignalR.ActiveConnection){
      SignalR.ActiveConnection = hubConnection(signalRConfiguration.BasePath ? signalRConfiguration.BasePath : defaultBasePath);
    }

    this.AuthorizationHub = new AuthorizationHub(SignalR.ActiveConnection.createHubProxy('AuthorizationHub'), signalRConfiguration.Log);
    
    this.AppHub = new AppHub(SignalR.ActiveConnection.createHubProxy("AppHub"), signalRConfiguration.Log);
	
    this.BankAccountHub = new BankAccountHub(SignalR.ActiveConnection.createHubProxy("BankAccountHub"), signalRConfiguration.Log);
	
    this.HydraHub = new HydraHub(SignalR.ActiveConnection.createHubProxy("HydraHub"), signalRConfiguration.Log);
	
    this.MenuCheckpointHub = new MenuCheckpointHub(SignalR.ActiveConnection.createHubProxy("MenuCheckpointHub"), signalRConfiguration.Log);
	
    this.StoreGroupHub = new StoreGroupHub(SignalR.ActiveConnection.createHubProxy("StoreGroupHub"), signalRConfiguration.Log);
	
    this.TeammateHub = new TeammateHub(SignalR.ActiveConnection.createHubProxy("TeammateHub"), signalRConfiguration.Log);
	
    this.VoucherHub = new VoucherHub(SignalR.ActiveConnection.createHubProxy("VoucherHub"), signalRConfiguration.Log);
	
    this.WebsiteHub = new WebsiteHub(SignalR.ActiveConnection.createHubProxy("WebsiteHub"), signalRConfiguration.Log);
	
    this.AnalyticsHub = new AnalyticsHub(SignalR.ActiveConnection.createHubProxy("AnalyticsHub"), signalRConfiguration.Log);
	
    this.CampaignHub = new CampaignHub(SignalR.ActiveConnection.createHubProxy("CampaignHub"), signalRConfiguration.Log);
	
    this.CustomerHub = new CustomerHub(SignalR.ActiveConnection.createHubProxy("CustomerHub"), signalRConfiguration.Log);
	
    this.MenuHub = new MenuHub(SignalR.ActiveConnection.createHubProxy("MenuHub"), signalRConfiguration.Log);
	
    this.OrderHub = new OrderHub(SignalR.ActiveConnection.createHubProxy("OrderHub"), signalRConfiguration.Log);
	
    this.PhoneCallHub = new PhoneCallHub(SignalR.ActiveConnection.createHubProxy("PhoneCallHub"), signalRConfiguration.Log);
	
    this.PrinterHub = new PrinterHub(SignalR.ActiveConnection.createHubProxy("PrinterHub"), signalRConfiguration.Log);
	
    this.StoreHub = new StoreHub(SignalR.ActiveConnection.createHubProxy("StoreHub"), signalRConfiguration.Log);
	
    this.WebhookHub = new WebhookHub(SignalR.ActiveConnection.createHubProxy("WebhookHub"), signalRConfiguration.Log);
	
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
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.HydraAssignedCallback = undefined;
    
    this.HydraRequestResetCallback = undefined;
    
    this.HydraSettingChangedCallback = undefined;
    
    this.HydraConnectionStatusChangedCallback = undefined;
    
    this.HydraUnAssignedCallback = undefined;
    
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
  
}
/* HydraHub End */


/* MenuCheckpointHub Start */

/**
 * MenuCheckpointCreated Subscription Callback
*/
export interface MenuCheckpointCreatedCallback{
  (data: Flipdish.MenuCheckpointCreatedEvent): void;
}


/**
 * MenuCheckpointHub
 */
export class MenuCheckpointHub {
  private proxy: Proxy;
  private log: boolean;
  
  private MenuCheckpointCreatedCallback: MenuCheckpointCreatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.MenuCheckpointCreatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("menu_checkpoint.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuCheckpointCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuCheckpointCreatedCallback){
        if(this.log){
          console.log("menu_checkpoint.created received");
          console.log(eventData.Body);
        }
        this.MenuCheckpointCreatedCallback(data);
      }
    });
      
  }
  
  public OnMenuCheckpointCreated(callback: MenuCheckpointCreatedCallback){
    if(this.log){
      console.log("menu_checkpoint.created subscribed");
    }
    this.MenuCheckpointCreatedCallback = callback;
  }
  public OffMenuCheckpointCreated(callback: MenuCheckpointCreatedCallback){
    if(this.log){
      console.log("menu_checkpoint.created unsubscribed");
    }
	this.MenuCheckpointCreatedCallback = undefined;
  }
  
}
/* MenuCheckpointHub End */


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
 * VoucherHub
 */
export class VoucherHub {
  private proxy: Proxy;
  private log: boolean;
  
  private VoucherCreatedCallback: VoucherCreatedCallback;
  
  private VoucherDeletedCallback: VoucherDeletedCallback;
  
  private VoucherUpdatedCallback: VoucherUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.VoucherCreatedCallback = undefined;
    
    this.VoucherDeletedCallback = undefined;
    
    this.VoucherUpdatedCallback = undefined;
    
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
  
}
/* VoucherHub End */


/* WebsiteHub Start */

/**
 * CertificateRenewed Subscription Callback
*/
export interface CertificateRenewedCallback{
  (data: Flipdish.CertificateRenewedEvent): void;
}

/**
 * CertificateCreated Subscription Callback
*/
export interface CertificateCreatedCallback{
  (data: Flipdish.CertificateCreatedEvent): void;
}

/**
 * DnsVerified Subscription Callback
*/
export interface DnsVerifiedCallback{
  (data: Flipdish.DnsVerifiedEvent): void;
}


/**
 * WebsiteHub
 */
export class WebsiteHub {
  private proxy: Proxy;
  private log: boolean;
  
  private CertificateRenewedCallback: CertificateRenewedCallback;
  
  private CertificateCreatedCallback: CertificateCreatedCallback;
  
  private DnsVerifiedCallback: DnsVerifiedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.CertificateRenewedCallback = undefined;
    
    this.CertificateCreatedCallback = undefined;
    
    this.DnsVerifiedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("website.certificate.renewed", (eventData:SignalrEvent) => {
      var data:Flipdish.CertificateRenewedEvent = JSON.parse(eventData.Body);
      if(this.CertificateRenewedCallback){
        if(this.log){
          console.log("website.certificate.renewed received");
          console.log(eventData.Body);
        }
        this.CertificateRenewedCallback(data);
      }
    });
      
    this.proxy.on("website.certificate.created", (eventData:SignalrEvent) => {
      var data:Flipdish.CertificateCreatedEvent = JSON.parse(eventData.Body);
      if(this.CertificateCreatedCallback){
        if(this.log){
          console.log("website.certificate.created received");
          console.log(eventData.Body);
        }
        this.CertificateCreatedCallback(data);
      }
    });
      
    this.proxy.on("website.dns.verified", (eventData:SignalrEvent) => {
      var data:Flipdish.DnsVerifiedEvent = JSON.parse(eventData.Body);
      if(this.DnsVerifiedCallback){
        if(this.log){
          console.log("website.dns.verified received");
          console.log(eventData.Body);
        }
        this.DnsVerifiedCallback(data);
      }
    });
      
  }
  
  public OnCertificateRenewed(callback: CertificateRenewedCallback){
    if(this.log){
      console.log("website.certificate.renewed subscribed");
    }
    this.CertificateRenewedCallback = callback;
  }
  public OffCertificateRenewed(callback: CertificateRenewedCallback){
    if(this.log){
      console.log("website.certificate.renewed unsubscribed");
    }
	this.CertificateRenewedCallback = undefined;
  }
  
  public OnCertificateCreated(callback: CertificateCreatedCallback){
    if(this.log){
      console.log("website.certificate.created subscribed");
    }
    this.CertificateCreatedCallback = callback;
  }
  public OffCertificateCreated(callback: CertificateCreatedCallback){
    if(this.log){
      console.log("website.certificate.created unsubscribed");
    }
	this.CertificateCreatedCallback = undefined;
  }
  
  public OnDnsVerified(callback: DnsVerifiedCallback){
    if(this.log){
      console.log("website.dns.verified subscribed");
    }
    this.DnsVerifiedCallback = callback;
  }
  public OffDnsVerified(callback: DnsVerifiedCallback){
    if(this.log){
      console.log("website.dns.verified unsubscribed");
    }
	this.DnsVerifiedCallback = undefined;
  }
  
}
/* WebsiteHub End */


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


/* CampaignHub Start */

/**
 * LoyaltyCampaignCreated Subscription Callback
*/
export interface LoyaltyCampaignCreatedCallback{
  (data: Flipdish.LoyaltyCampaignCreatedEvent): void;
}

/**
 * LoyaltyCampaignDeleted Subscription Callback
*/
export interface LoyaltyCampaignDeletedCallback{
  (data: Flipdish.LoyaltyCampaignDeletedEvent): void;
}

/**
 * LoyaltyCampaignUpdated Subscription Callback
*/
export interface LoyaltyCampaignUpdatedCallback{
  (data: Flipdish.LoyaltyCampaignUpdatedEvent): void;
}

/**
 * RetentionCampaignCreated Subscription Callback
*/
export interface RetentionCampaignCreatedCallback{
  (data: Flipdish.RetentionCampaignCreatedEvent): void;
}

/**
 * RetentionCampaignDeleted Subscription Callback
*/
export interface RetentionCampaignDeletedCallback{
  (data: Flipdish.RetentionCampaignDeletedEvent): void;
}

/**
 * RetentionCampaignUpdated Subscription Callback
*/
export interface RetentionCampaignUpdatedCallback{
  (data: Flipdish.RetentionCampaignUpdatedEvent): void;
}


/**
 * CampaignHub
 */
export class CampaignHub {
  private proxy: Proxy;
  private log: boolean;
  
  private LoyaltyCampaignCreatedCallback: LoyaltyCampaignCreatedCallback;
  
  private LoyaltyCampaignDeletedCallback: LoyaltyCampaignDeletedCallback;
  
  private LoyaltyCampaignUpdatedCallback: LoyaltyCampaignUpdatedCallback;
  
  private RetentionCampaignCreatedCallback: RetentionCampaignCreatedCallback;
  
  private RetentionCampaignDeletedCallback: RetentionCampaignDeletedCallback;
  
  private RetentionCampaignUpdatedCallback: RetentionCampaignUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.LoyaltyCampaignCreatedCallback = undefined;
    
    this.LoyaltyCampaignDeletedCallback = undefined;
    
    this.LoyaltyCampaignUpdatedCallback = undefined;
    
    this.RetentionCampaignCreatedCallback = undefined;
    
    this.RetentionCampaignDeletedCallback = undefined;
    
    this.RetentionCampaignUpdatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("campaign.loyalty.created", (eventData:SignalrEvent) => {
      var data:Flipdish.LoyaltyCampaignCreatedEvent = JSON.parse(eventData.Body);
      if(this.LoyaltyCampaignCreatedCallback){
        if(this.log){
          console.log("campaign.loyalty.created received");
          console.log(eventData.Body);
        }
        this.LoyaltyCampaignCreatedCallback(data);
      }
    });
      
    this.proxy.on("campaign.loyalty.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.LoyaltyCampaignDeletedEvent = JSON.parse(eventData.Body);
      if(this.LoyaltyCampaignDeletedCallback){
        if(this.log){
          console.log("campaign.loyalty.deleted received");
          console.log(eventData.Body);
        }
        this.LoyaltyCampaignDeletedCallback(data);
      }
    });
      
    this.proxy.on("campaign.loyalty.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.LoyaltyCampaignUpdatedEvent = JSON.parse(eventData.Body);
      if(this.LoyaltyCampaignUpdatedCallback){
        if(this.log){
          console.log("campaign.loyalty.updated received");
          console.log(eventData.Body);
        }
        this.LoyaltyCampaignUpdatedCallback(data);
      }
    });
      
    this.proxy.on("campaign.retention.created", (eventData:SignalrEvent) => {
      var data:Flipdish.RetentionCampaignCreatedEvent = JSON.parse(eventData.Body);
      if(this.RetentionCampaignCreatedCallback){
        if(this.log){
          console.log("campaign.retention.created received");
          console.log(eventData.Body);
        }
        this.RetentionCampaignCreatedCallback(data);
      }
    });
      
    this.proxy.on("campaign.retention.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.RetentionCampaignDeletedEvent = JSON.parse(eventData.Body);
      if(this.RetentionCampaignDeletedCallback){
        if(this.log){
          console.log("campaign.retention.deleted received");
          console.log(eventData.Body);
        }
        this.RetentionCampaignDeletedCallback(data);
      }
    });
      
    this.proxy.on("campaign.retention.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.RetentionCampaignUpdatedEvent = JSON.parse(eventData.Body);
      if(this.RetentionCampaignUpdatedCallback){
        if(this.log){
          console.log("campaign.retention.updated received");
          console.log(eventData.Body);
        }
        this.RetentionCampaignUpdatedCallback(data);
      }
    });
      
  }
  
  public OnLoyaltyCampaignCreated(callback: LoyaltyCampaignCreatedCallback){
    if(this.log){
      console.log("campaign.loyalty.created subscribed");
    }
    this.LoyaltyCampaignCreatedCallback = callback;
  }
  public OffLoyaltyCampaignCreated(callback: LoyaltyCampaignCreatedCallback){
    if(this.log){
      console.log("campaign.loyalty.created unsubscribed");
    }
	this.LoyaltyCampaignCreatedCallback = undefined;
  }
  
  public OnLoyaltyCampaignDeleted(callback: LoyaltyCampaignDeletedCallback){
    if(this.log){
      console.log("campaign.loyalty.deleted subscribed");
    }
    this.LoyaltyCampaignDeletedCallback = callback;
  }
  public OffLoyaltyCampaignDeleted(callback: LoyaltyCampaignDeletedCallback){
    if(this.log){
      console.log("campaign.loyalty.deleted unsubscribed");
    }
	this.LoyaltyCampaignDeletedCallback = undefined;
  }
  
  public OnLoyaltyCampaignUpdated(callback: LoyaltyCampaignUpdatedCallback){
    if(this.log){
      console.log("campaign.loyalty.updated subscribed");
    }
    this.LoyaltyCampaignUpdatedCallback = callback;
  }
  public OffLoyaltyCampaignUpdated(callback: LoyaltyCampaignUpdatedCallback){
    if(this.log){
      console.log("campaign.loyalty.updated unsubscribed");
    }
	this.LoyaltyCampaignUpdatedCallback = undefined;
  }
  
  public OnRetentionCampaignCreated(callback: RetentionCampaignCreatedCallback){
    if(this.log){
      console.log("campaign.retention.created subscribed");
    }
    this.RetentionCampaignCreatedCallback = callback;
  }
  public OffRetentionCampaignCreated(callback: RetentionCampaignCreatedCallback){
    if(this.log){
      console.log("campaign.retention.created unsubscribed");
    }
	this.RetentionCampaignCreatedCallback = undefined;
  }
  
  public OnRetentionCampaignDeleted(callback: RetentionCampaignDeletedCallback){
    if(this.log){
      console.log("campaign.retention.deleted subscribed");
    }
    this.RetentionCampaignDeletedCallback = callback;
  }
  public OffRetentionCampaignDeleted(callback: RetentionCampaignDeletedCallback){
    if(this.log){
      console.log("campaign.retention.deleted unsubscribed");
    }
	this.RetentionCampaignDeletedCallback = undefined;
  }
  
  public OnRetentionCampaignUpdated(callback: RetentionCampaignUpdatedCallback){
    if(this.log){
      console.log("campaign.retention.updated subscribed");
    }
    this.RetentionCampaignUpdatedCallback = callback;
  }
  public OffRetentionCampaignUpdated(callback: RetentionCampaignUpdatedCallback){
    if(this.log){
      console.log("campaign.retention.updated unsubscribed");
    }
	this.RetentionCampaignUpdatedCallback = undefined;
  }
  
}
/* CampaignHub End */


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


/* MenuHub Start */

/**
 * MenuCreated Subscription Callback
*/
export interface MenuCreatedCallback{
  (data: Flipdish.MenuCreatedEvent): void;
}

/**
 * MenuUpdated Subscription Callback
*/
export interface MenuUpdatedCallback{
  (data: Flipdish.MenuUpdatedEvent): void;
}

/**
 * MenuSectionCreated Subscription Callback
*/
export interface MenuSectionCreatedCallback{
  (data: Flipdish.MenuSectionCreatedEvent): void;
}

/**
 * MenuSectionUpdated Subscription Callback
*/
export interface MenuSectionUpdatedCallback{
  (data: Flipdish.MenuSectionUpdatedEvent): void;
}

/**
 * MenuSectionDeleted Subscription Callback
*/
export interface MenuSectionDeletedCallback{
  (data: Flipdish.MenuSectionDeletedEvent): void;
}

/**
 * MenuSectionItemCreated Subscription Callback
*/
export interface MenuSectionItemCreatedCallback{
  (data: Flipdish.MenuSectionItemCreatedEvent): void;
}

/**
 * MenuSectionItemUpdated Subscription Callback
*/
export interface MenuSectionItemUpdatedCallback{
  (data: Flipdish.MenuSectionItemUpdatedEvent): void;
}

/**
 * MenuSectionItemDeleted Subscription Callback
*/
export interface MenuSectionItemDeletedCallback{
  (data: Flipdish.MenuSectionItemDeletedEvent): void;
}

/**
 * MenuItemOptionSetCreated Subscription Callback
*/
export interface MenuItemOptionSetCreatedCallback{
  (data: Flipdish.MenuItemOptionSetCreatedEvent): void;
}

/**
 * MenuItemOptionSetUpdated Subscription Callback
*/
export interface MenuItemOptionSetUpdatedCallback{
  (data: Flipdish.MenuItemOptionSetUpdatedEvent): void;
}

/**
 * MenuItemOptionSetDeleted Subscription Callback
*/
export interface MenuItemOptionSetDeletedCallback{
  (data: Flipdish.MenuItemOptionSetDeletedEvent): void;
}

/**
 * MenuItemOptionSetItemCreated Subscription Callback
*/
export interface MenuItemOptionSetItemCreatedCallback{
  (data: Flipdish.MenuItemOptionSetItemCreatedEvent): void;
}

/**
 * MenuItemOptionSetItemUpdated Subscription Callback
*/
export interface MenuItemOptionSetItemUpdatedCallback{
  (data: Flipdish.MenuItemOptionSetItemUpdatedEvent): void;
}

/**
 * MenuItemOptionSetItemDeleted Subscription Callback
*/
export interface MenuItemOptionSetItemDeletedCallback{
  (data: Flipdish.MenuItemOptionSetItemDeletedEvent): void;
}

/**
 * MenuCheckpointCreated Subscription Callback
*/
export interface MenuCheckpointCreatedCallback{
  (data: Flipdish.MenuCheckpointCreatedEvent): void;
}


/**
 * MenuHub
 */
export class MenuHub {
  private proxy: Proxy;
  private log: boolean;
  
  private MenuCreatedCallback: MenuCreatedCallback;
  
  private MenuUpdatedCallback: MenuUpdatedCallback;
  
  private MenuSectionCreatedCallback: MenuSectionCreatedCallback;
  
  private MenuSectionUpdatedCallback: MenuSectionUpdatedCallback;
  
  private MenuSectionDeletedCallback: MenuSectionDeletedCallback;
  
  private MenuSectionItemCreatedCallback: MenuSectionItemCreatedCallback;
  
  private MenuSectionItemUpdatedCallback: MenuSectionItemUpdatedCallback;
  
  private MenuSectionItemDeletedCallback: MenuSectionItemDeletedCallback;
  
  private MenuItemOptionSetCreatedCallback: MenuItemOptionSetCreatedCallback;
  
  private MenuItemOptionSetUpdatedCallback: MenuItemOptionSetUpdatedCallback;
  
  private MenuItemOptionSetDeletedCallback: MenuItemOptionSetDeletedCallback;
  
  private MenuItemOptionSetItemCreatedCallback: MenuItemOptionSetItemCreatedCallback;
  
  private MenuItemOptionSetItemUpdatedCallback: MenuItemOptionSetItemUpdatedCallback;
  
  private MenuItemOptionSetItemDeletedCallback: MenuItemOptionSetItemDeletedCallback;
  
  private MenuCheckpointCreatedCallback: MenuCheckpointCreatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.MenuCreatedCallback = undefined;
    
    this.MenuUpdatedCallback = undefined;
    
    this.MenuSectionCreatedCallback = undefined;
    
    this.MenuSectionUpdatedCallback = undefined;
    
    this.MenuSectionDeletedCallback = undefined;
    
    this.MenuSectionItemCreatedCallback = undefined;
    
    this.MenuSectionItemUpdatedCallback = undefined;
    
    this.MenuSectionItemDeletedCallback = undefined;
    
    this.MenuItemOptionSetCreatedCallback = undefined;
    
    this.MenuItemOptionSetUpdatedCallback = undefined;
    
    this.MenuItemOptionSetDeletedCallback = undefined;
    
    this.MenuItemOptionSetItemCreatedCallback = undefined;
    
    this.MenuItemOptionSetItemUpdatedCallback = undefined;
    
    this.MenuItemOptionSetItemDeletedCallback = undefined;
    
    this.MenuCheckpointCreatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("menu.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuCreatedCallback){
        if(this.log){
          console.log("menu.created received");
          console.log(eventData.Body);
        }
        this.MenuCreatedCallback(data);
      }
    });
      
    this.proxy.on("menu.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuUpdatedEvent = JSON.parse(eventData.Body);
      if(this.MenuUpdatedCallback){
        if(this.log){
          console.log("menu.updated received");
          console.log(eventData.Body);
        }
        this.MenuUpdatedCallback(data);
      }
    });
      
    this.proxy.on("menu.section.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionCreatedCallback){
        if(this.log){
          console.log("menu.section.created received");
          console.log(eventData.Body);
        }
        this.MenuSectionCreatedCallback(data);
      }
    });
      
    this.proxy.on("menu.section.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionUpdatedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionUpdatedCallback){
        if(this.log){
          console.log("menu.section.updated received");
          console.log(eventData.Body);
        }
        this.MenuSectionUpdatedCallback(data);
      }
    });
      
    this.proxy.on("menu.section.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionDeletedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionDeletedCallback){
        if(this.log){
          console.log("menu.section.deleted received");
          console.log(eventData.Body);
        }
        this.MenuSectionDeletedCallback(data);
      }
    });
      
    this.proxy.on("menu.section_item.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionItemCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionItemCreatedCallback){
        if(this.log){
          console.log("menu.section_item.created received");
          console.log(eventData.Body);
        }
        this.MenuSectionItemCreatedCallback(data);
      }
    });
      
    this.proxy.on("menu.section_item.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionItemUpdatedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionItemUpdatedCallback){
        if(this.log){
          console.log("menu.section_item.updated received");
          console.log(eventData.Body);
        }
        this.MenuSectionItemUpdatedCallback(data);
      }
    });
      
    this.proxy.on("menu.section_item.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuSectionItemDeletedEvent = JSON.parse(eventData.Body);
      if(this.MenuSectionItemDeletedCallback){
        if(this.log){
          console.log("menu.section_item.deleted received");
          console.log(eventData.Body);
        }
        this.MenuSectionItemDeletedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetCreatedCallback){
        if(this.log){
          console.log("menu.option_set.created received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetCreatedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetUpdatedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetUpdatedCallback){
        if(this.log){
          console.log("menu.option_set.updated received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetUpdatedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetDeletedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetDeletedCallback){
        if(this.log){
          console.log("menu.option_set.deleted received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetDeletedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set_item.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetItemCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetItemCreatedCallback){
        if(this.log){
          console.log("menu.option_set_item.created received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetItemCreatedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set_item.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetItemUpdatedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetItemUpdatedCallback){
        if(this.log){
          console.log("menu.option_set_item.updated received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetItemUpdatedCallback(data);
      }
    });
      
    this.proxy.on("menu.option_set_item.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuItemOptionSetItemDeletedEvent = JSON.parse(eventData.Body);
      if(this.MenuItemOptionSetItemDeletedCallback){
        if(this.log){
          console.log("menu.option_set_item.deleted received");
          console.log(eventData.Body);
        }
        this.MenuItemOptionSetItemDeletedCallback(data);
      }
    });
      
    this.proxy.on("menu_checkpoint.created", (eventData:SignalrEvent) => {
      var data:Flipdish.MenuCheckpointCreatedEvent = JSON.parse(eventData.Body);
      if(this.MenuCheckpointCreatedCallback){
        if(this.log){
          console.log("menu_checkpoint.created received");
          console.log(eventData.Body);
        }
        this.MenuCheckpointCreatedCallback(data);
      }
    });
      
  }
  
  public OnMenuCreated(callback: MenuCreatedCallback){
    if(this.log){
      console.log("menu.created subscribed");
    }
    this.MenuCreatedCallback = callback;
  }
  public OffMenuCreated(callback: MenuCreatedCallback){
    if(this.log){
      console.log("menu.created unsubscribed");
    }
	this.MenuCreatedCallback = undefined;
  }
  
  public OnMenuUpdated(callback: MenuUpdatedCallback){
    if(this.log){
      console.log("menu.updated subscribed");
    }
    this.MenuUpdatedCallback = callback;
  }
  public OffMenuUpdated(callback: MenuUpdatedCallback){
    if(this.log){
      console.log("menu.updated unsubscribed");
    }
	this.MenuUpdatedCallback = undefined;
  }
  
  public OnMenuSectionCreated(callback: MenuSectionCreatedCallback){
    if(this.log){
      console.log("menu.section.created subscribed");
    }
    this.MenuSectionCreatedCallback = callback;
  }
  public OffMenuSectionCreated(callback: MenuSectionCreatedCallback){
    if(this.log){
      console.log("menu.section.created unsubscribed");
    }
	this.MenuSectionCreatedCallback = undefined;
  }
  
  public OnMenuSectionUpdated(callback: MenuSectionUpdatedCallback){
    if(this.log){
      console.log("menu.section.updated subscribed");
    }
    this.MenuSectionUpdatedCallback = callback;
  }
  public OffMenuSectionUpdated(callback: MenuSectionUpdatedCallback){
    if(this.log){
      console.log("menu.section.updated unsubscribed");
    }
	this.MenuSectionUpdatedCallback = undefined;
  }
  
  public OnMenuSectionDeleted(callback: MenuSectionDeletedCallback){
    if(this.log){
      console.log("menu.section.deleted subscribed");
    }
    this.MenuSectionDeletedCallback = callback;
  }
  public OffMenuSectionDeleted(callback: MenuSectionDeletedCallback){
    if(this.log){
      console.log("menu.section.deleted unsubscribed");
    }
	this.MenuSectionDeletedCallback = undefined;
  }
  
  public OnMenuSectionItemCreated(callback: MenuSectionItemCreatedCallback){
    if(this.log){
      console.log("menu.section_item.created subscribed");
    }
    this.MenuSectionItemCreatedCallback = callback;
  }
  public OffMenuSectionItemCreated(callback: MenuSectionItemCreatedCallback){
    if(this.log){
      console.log("menu.section_item.created unsubscribed");
    }
	this.MenuSectionItemCreatedCallback = undefined;
  }
  
  public OnMenuSectionItemUpdated(callback: MenuSectionItemUpdatedCallback){
    if(this.log){
      console.log("menu.section_item.updated subscribed");
    }
    this.MenuSectionItemUpdatedCallback = callback;
  }
  public OffMenuSectionItemUpdated(callback: MenuSectionItemUpdatedCallback){
    if(this.log){
      console.log("menu.section_item.updated unsubscribed");
    }
	this.MenuSectionItemUpdatedCallback = undefined;
  }
  
  public OnMenuSectionItemDeleted(callback: MenuSectionItemDeletedCallback){
    if(this.log){
      console.log("menu.section_item.deleted subscribed");
    }
    this.MenuSectionItemDeletedCallback = callback;
  }
  public OffMenuSectionItemDeleted(callback: MenuSectionItemDeletedCallback){
    if(this.log){
      console.log("menu.section_item.deleted unsubscribed");
    }
	this.MenuSectionItemDeletedCallback = undefined;
  }
  
  public OnMenuItemOptionSetCreated(callback: MenuItemOptionSetCreatedCallback){
    if(this.log){
      console.log("menu.option_set.created subscribed");
    }
    this.MenuItemOptionSetCreatedCallback = callback;
  }
  public OffMenuItemOptionSetCreated(callback: MenuItemOptionSetCreatedCallback){
    if(this.log){
      console.log("menu.option_set.created unsubscribed");
    }
	this.MenuItemOptionSetCreatedCallback = undefined;
  }
  
  public OnMenuItemOptionSetUpdated(callback: MenuItemOptionSetUpdatedCallback){
    if(this.log){
      console.log("menu.option_set.updated subscribed");
    }
    this.MenuItemOptionSetUpdatedCallback = callback;
  }
  public OffMenuItemOptionSetUpdated(callback: MenuItemOptionSetUpdatedCallback){
    if(this.log){
      console.log("menu.option_set.updated unsubscribed");
    }
	this.MenuItemOptionSetUpdatedCallback = undefined;
  }
  
  public OnMenuItemOptionSetDeleted(callback: MenuItemOptionSetDeletedCallback){
    if(this.log){
      console.log("menu.option_set.deleted subscribed");
    }
    this.MenuItemOptionSetDeletedCallback = callback;
  }
  public OffMenuItemOptionSetDeleted(callback: MenuItemOptionSetDeletedCallback){
    if(this.log){
      console.log("menu.option_set.deleted unsubscribed");
    }
	this.MenuItemOptionSetDeletedCallback = undefined;
  }
  
  public OnMenuItemOptionSetItemCreated(callback: MenuItemOptionSetItemCreatedCallback){
    if(this.log){
      console.log("menu.option_set_item.created subscribed");
    }
    this.MenuItemOptionSetItemCreatedCallback = callback;
  }
  public OffMenuItemOptionSetItemCreated(callback: MenuItemOptionSetItemCreatedCallback){
    if(this.log){
      console.log("menu.option_set_item.created unsubscribed");
    }
	this.MenuItemOptionSetItemCreatedCallback = undefined;
  }
  
  public OnMenuItemOptionSetItemUpdated(callback: MenuItemOptionSetItemUpdatedCallback){
    if(this.log){
      console.log("menu.option_set_item.updated subscribed");
    }
    this.MenuItemOptionSetItemUpdatedCallback = callback;
  }
  public OffMenuItemOptionSetItemUpdated(callback: MenuItemOptionSetItemUpdatedCallback){
    if(this.log){
      console.log("menu.option_set_item.updated unsubscribed");
    }
	this.MenuItemOptionSetItemUpdatedCallback = undefined;
  }
  
  public OnMenuItemOptionSetItemDeleted(callback: MenuItemOptionSetItemDeletedCallback){
    if(this.log){
      console.log("menu.option_set_item.deleted subscribed");
    }
    this.MenuItemOptionSetItemDeletedCallback = callback;
  }
  public OffMenuItemOptionSetItemDeleted(callback: MenuItemOptionSetItemDeletedCallback){
    if(this.log){
      console.log("menu.option_set_item.deleted unsubscribed");
    }
	this.MenuItemOptionSetItemDeletedCallback = undefined;
  }
  
  public OnMenuCheckpointCreated(callback: MenuCheckpointCreatedCallback){
    if(this.log){
      console.log("menu_checkpoint.created subscribed");
    }
    this.MenuCheckpointCreatedCallback = callback;
  }
  public OffMenuCheckpointCreated(callback: MenuCheckpointCreatedCallback){
    if(this.log){
      console.log("menu_checkpoint.created unsubscribed");
    }
	this.MenuCheckpointCreatedCallback = undefined;
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
 * OrderDispatched Subscription Callback
*/
export interface OrderDispatchedCallback{
  (data: Flipdish.OrderDispatchedEvent): void;
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
 * OrderTipUpdated Subscription Callback
*/
export interface OrderTipUpdatedCallback{
  (data: Flipdish.OrderTipUpdatedEvent): void;
}

/**
 * OrderRatingUpdated Subscription Callback
*/
export interface OrderRatingUpdatedCallback{
  (data: Flipdish.OrderRatingUpdatedEvent): void;
}

/**
 * OrderDeliveryTrackingStatusUpdated Subscription Callback
*/
export interface OrderDeliveryTrackingStatusUpdatedCallback{
  (data: Flipdish.OrderDeliveryTrackingStatusUpdatedEvent): void;
}


/**
 * OrderHub
 */
export class OrderHub {
  private proxy: Proxy;
  private log: boolean;
  
  private OrderCreatedCallback: OrderCreatedCallback;
  
  private OrderDispatchedCallback: OrderDispatchedCallback;
  
  private OrderRejectedCallback: OrderRejectedCallback;
  
  private OrderAcceptedCallback: OrderAcceptedCallback;
  
  private OrderRefundedCallback: OrderRefundedCallback;
  
  private OrderTipUpdatedCallback: OrderTipUpdatedCallback;
  
  private OrderRatingUpdatedCallback: OrderRatingUpdatedCallback;
  
  private OrderDeliveryTrackingStatusUpdatedCallback: OrderDeliveryTrackingStatusUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.OrderCreatedCallback = undefined;
    
    this.OrderDispatchedCallback = undefined;
    
    this.OrderRejectedCallback = undefined;
    
    this.OrderAcceptedCallback = undefined;
    
    this.OrderRefundedCallback = undefined;
    
    this.OrderTipUpdatedCallback = undefined;
    
    this.OrderRatingUpdatedCallback = undefined;
    
    this.OrderDeliveryTrackingStatusUpdatedCallback = undefined;
    
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
      
    this.proxy.on("order.dispatched", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderDispatchedEvent = JSON.parse(eventData.Body);
      if(this.OrderDispatchedCallback){
        if(this.log){
          console.log("order.dispatched received");
          console.log(eventData.Body);
        }
        this.OrderDispatchedCallback(data);
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
      
    this.proxy.on("order.tip.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderTipUpdatedEvent = JSON.parse(eventData.Body);
      if(this.OrderTipUpdatedCallback){
        if(this.log){
          console.log("order.tip.updated received");
          console.log(eventData.Body);
        }
        this.OrderTipUpdatedCallback(data);
      }
    });
      
    this.proxy.on("order.rating.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderRatingUpdatedEvent = JSON.parse(eventData.Body);
      if(this.OrderRatingUpdatedCallback){
        if(this.log){
          console.log("order.rating.updated received");
          console.log(eventData.Body);
        }
        this.OrderRatingUpdatedCallback(data);
      }
    });
      
    this.proxy.on("order.deliverytracking.status.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.OrderDeliveryTrackingStatusUpdatedEvent = JSON.parse(eventData.Body);
      if(this.OrderDeliveryTrackingStatusUpdatedCallback){
        if(this.log){
          console.log("order.deliverytracking.status.updated received");
          console.log(eventData.Body);
        }
        this.OrderDeliveryTrackingStatusUpdatedCallback(data);
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
  
  public OnOrderDispatched(callback: OrderDispatchedCallback){
    if(this.log){
      console.log("order.dispatched subscribed");
    }
    this.OrderDispatchedCallback = callback;
  }
  public OffOrderDispatched(callback: OrderDispatchedCallback){
    if(this.log){
      console.log("order.dispatched unsubscribed");
    }
	this.OrderDispatchedCallback = undefined;
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
  
  public OnOrderTipUpdated(callback: OrderTipUpdatedCallback){
    if(this.log){
      console.log("order.tip.updated subscribed");
    }
    this.OrderTipUpdatedCallback = callback;
  }
  public OffOrderTipUpdated(callback: OrderTipUpdatedCallback){
    if(this.log){
      console.log("order.tip.updated unsubscribed");
    }
	this.OrderTipUpdatedCallback = undefined;
  }
  
  public OnOrderRatingUpdated(callback: OrderRatingUpdatedCallback){
    if(this.log){
      console.log("order.rating.updated subscribed");
    }
    this.OrderRatingUpdatedCallback = callback;
  }
  public OffOrderRatingUpdated(callback: OrderRatingUpdatedCallback){
    if(this.log){
      console.log("order.rating.updated unsubscribed");
    }
	this.OrderRatingUpdatedCallback = undefined;
  }
  
  public OnOrderDeliveryTrackingStatusUpdated(callback: OrderDeliveryTrackingStatusUpdatedCallback){
    if(this.log){
      console.log("order.deliverytracking.status.updated subscribed");
    }
    this.OrderDeliveryTrackingStatusUpdatedCallback = callback;
  }
  public OffOrderDeliveryTrackingStatusUpdated(callback: OrderDeliveryTrackingStatusUpdatedCallback){
    if(this.log){
      console.log("order.deliverytracking.status.updated unsubscribed");
    }
	this.OrderDeliveryTrackingStatusUpdatedCallback = undefined;
  }
  
}
/* OrderHub End */


/* PhoneCallHub Start */

/**
 * PhoneCallStarted Subscription Callback
*/
export interface PhoneCallStartedCallback{
  (data: Flipdish.PhoneCallStartedEvent): void;
}

/**
 * PhoneCallEnded Subscription Callback
*/
export interface PhoneCallEndedCallback{
  (data: Flipdish.PhoneCallEndedEvent): void;
}


/**
 * PhoneCallHub
 */
export class PhoneCallHub {
  private proxy: Proxy;
  private log: boolean;
  
  private PhoneCallStartedCallback: PhoneCallStartedCallback;
  
  private PhoneCallEndedCallback: PhoneCallEndedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.PhoneCallStartedCallback = undefined;
    
    this.PhoneCallEndedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("phone_call.started", (eventData:SignalrEvent) => {
      var data:Flipdish.PhoneCallStartedEvent = JSON.parse(eventData.Body);
      if(this.PhoneCallStartedCallback){
        if(this.log){
          console.log("phone_call.started received");
          console.log(eventData.Body);
        }
        this.PhoneCallStartedCallback(data);
      }
    });
      
    this.proxy.on("phone_call.ended", (eventData:SignalrEvent) => {
      var data:Flipdish.PhoneCallEndedEvent = JSON.parse(eventData.Body);
      if(this.PhoneCallEndedCallback){
        if(this.log){
          console.log("phone_call.ended received");
          console.log(eventData.Body);
        }
        this.PhoneCallEndedCallback(data);
      }
    });
      
  }
  
  public OnPhoneCallStarted(callback: PhoneCallStartedCallback){
    if(this.log){
      console.log("phone_call.started subscribed");
    }
    this.PhoneCallStartedCallback = callback;
  }
  public OffPhoneCallStarted(callback: PhoneCallStartedCallback){
    if(this.log){
      console.log("phone_call.started unsubscribed");
    }
	this.PhoneCallStartedCallback = undefined;
  }
  
  public OnPhoneCallEnded(callback: PhoneCallEndedCallback){
    if(this.log){
      console.log("phone_call.ended subscribed");
    }
    this.PhoneCallEndedCallback = callback;
  }
  public OffPhoneCallEnded(callback: PhoneCallEndedCallback){
    if(this.log){
      console.log("phone_call.ended unsubscribed");
    }
	this.PhoneCallEndedCallback = undefined;
  }
  
}
/* PhoneCallHub End */


/* PrinterHub Start */

/**
 * PrinterTurnedOn Subscription Callback
*/
export interface PrinterTurnedOnCallback{
  (data: Flipdish.PrinterTurnedOnEvent): void;
}

/**
 * PrinterTurnedOff Subscription Callback
*/
export interface PrinterTurnedOffCallback{
  (data: Flipdish.PrinterTurnedOffEvent): void;
}

/**
 * PrinterAssignedToStore Subscription Callback
*/
export interface PrinterAssignedToStoreCallback{
  (data: Flipdish.PrinterAssignedToStoreEvent): void;
}

/**
 * PrinterUnassignedFromStore Subscription Callback
*/
export interface PrinterUnassignedFromStoreCallback{
  (data: Flipdish.PrinterUnassignedFromStoreEvent): void;
}


/**
 * PrinterHub
 */
export class PrinterHub {
  private proxy: Proxy;
  private log: boolean;
  
  private PrinterTurnedOnCallback: PrinterTurnedOnCallback;
  
  private PrinterTurnedOffCallback: PrinterTurnedOffCallback;
  
  private PrinterAssignedToStoreCallback: PrinterAssignedToStoreCallback;
  
  private PrinterUnassignedFromStoreCallback: PrinterUnassignedFromStoreCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.PrinterTurnedOnCallback = undefined;
    
    this.PrinterTurnedOffCallback = undefined;
    
    this.PrinterAssignedToStoreCallback = undefined;
    
    this.PrinterUnassignedFromStoreCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("printer.turned_on", (eventData:SignalrEvent) => {
      var data:Flipdish.PrinterTurnedOnEvent = JSON.parse(eventData.Body);
      if(this.PrinterTurnedOnCallback){
        if(this.log){
          console.log("printer.turned_on received");
          console.log(eventData.Body);
        }
        this.PrinterTurnedOnCallback(data);
      }
    });
      
    this.proxy.on("printer.turned_off", (eventData:SignalrEvent) => {
      var data:Flipdish.PrinterTurnedOffEvent = JSON.parse(eventData.Body);
      if(this.PrinterTurnedOffCallback){
        if(this.log){
          console.log("printer.turned_off received");
          console.log(eventData.Body);
        }
        this.PrinterTurnedOffCallback(data);
      }
    });
      
    this.proxy.on("printer.assigned_to_store", (eventData:SignalrEvent) => {
      var data:Flipdish.PrinterAssignedToStoreEvent = JSON.parse(eventData.Body);
      if(this.PrinterAssignedToStoreCallback){
        if(this.log){
          console.log("printer.assigned_to_store received");
          console.log(eventData.Body);
        }
        this.PrinterAssignedToStoreCallback(data);
      }
    });
      
    this.proxy.on("printer.unassigned_from_store", (eventData:SignalrEvent) => {
      var data:Flipdish.PrinterUnassignedFromStoreEvent = JSON.parse(eventData.Body);
      if(this.PrinterUnassignedFromStoreCallback){
        if(this.log){
          console.log("printer.unassigned_from_store received");
          console.log(eventData.Body);
        }
        this.PrinterUnassignedFromStoreCallback(data);
      }
    });
      
  }
  
  public OnPrinterTurnedOn(callback: PrinterTurnedOnCallback){
    if(this.log){
      console.log("printer.turned_on subscribed");
    }
    this.PrinterTurnedOnCallback = callback;
  }
  public OffPrinterTurnedOn(callback: PrinterTurnedOnCallback){
    if(this.log){
      console.log("printer.turned_on unsubscribed");
    }
	this.PrinterTurnedOnCallback = undefined;
  }
  
  public OnPrinterTurnedOff(callback: PrinterTurnedOffCallback){
    if(this.log){
      console.log("printer.turned_off subscribed");
    }
    this.PrinterTurnedOffCallback = callback;
  }
  public OffPrinterTurnedOff(callback: PrinterTurnedOffCallback){
    if(this.log){
      console.log("printer.turned_off unsubscribed");
    }
	this.PrinterTurnedOffCallback = undefined;
  }
  
  public OnPrinterAssignedToStore(callback: PrinterAssignedToStoreCallback){
    if(this.log){
      console.log("printer.assigned_to_store subscribed");
    }
    this.PrinterAssignedToStoreCallback = callback;
  }
  public OffPrinterAssignedToStore(callback: PrinterAssignedToStoreCallback){
    if(this.log){
      console.log("printer.assigned_to_store unsubscribed");
    }
	this.PrinterAssignedToStoreCallback = undefined;
  }
  
  public OnPrinterUnassignedFromStore(callback: PrinterUnassignedFromStoreCallback){
    if(this.log){
      console.log("printer.unassigned_from_store subscribed");
    }
    this.PrinterUnassignedFromStoreCallback = callback;
  }
  public OffPrinterUnassignedFromStore(callback: PrinterUnassignedFromStoreCallback){
    if(this.log){
      console.log("printer.unassigned_from_store unsubscribed");
    }
	this.PrinterUnassignedFromStoreCallback = undefined;
  }
  
}
/* PrinterHub End */


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
  
}
/* StoreHub End */


/* WebhookHub Start */

/**
 * WebhookSubscriptionCreated Subscription Callback
*/
export interface WebhookSubscriptionCreatedCallback{
  (data: Flipdish.WebhookSubscriptionCreatedEvent): void;
}

/**
 * WebhookSubscriptionUpdated Subscription Callback
*/
export interface WebhookSubscriptionUpdatedCallback{
  (data: Flipdish.WebhookSubscriptionUpdatedEvent): void;
}

/**
 * WebhookSubscriptionDeleted Subscription Callback
*/
export interface WebhookSubscriptionDeletedCallback{
  (data: Flipdish.WebhookSubscriptionDeletedEvent): void;
}


/**
 * WebhookHub
 */
export class WebhookHub {
  private proxy: Proxy;
  private log: boolean;
  
  private WebhookSubscriptionCreatedCallback: WebhookSubscriptionCreatedCallback;
  
  private WebhookSubscriptionUpdatedCallback: WebhookSubscriptionUpdatedCallback;
  
  private WebhookSubscriptionDeletedCallback: WebhookSubscriptionDeletedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.WebhookSubscriptionCreatedCallback = undefined;
    
    this.WebhookSubscriptionUpdatedCallback = undefined;
    
    this.WebhookSubscriptionDeletedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
    this.proxy.on("webhook_subscription.created", (eventData:SignalrEvent) => {
      var data:Flipdish.WebhookSubscriptionCreatedEvent = JSON.parse(eventData.Body);
      if(this.WebhookSubscriptionCreatedCallback){
        if(this.log){
          console.log("webhook_subscription.created received");
          console.log(eventData.Body);
        }
        this.WebhookSubscriptionCreatedCallback(data);
      }
    });
      
    this.proxy.on("webhook_subscription.updated", (eventData:SignalrEvent) => {
      var data:Flipdish.WebhookSubscriptionUpdatedEvent = JSON.parse(eventData.Body);
      if(this.WebhookSubscriptionUpdatedCallback){
        if(this.log){
          console.log("webhook_subscription.updated received");
          console.log(eventData.Body);
        }
        this.WebhookSubscriptionUpdatedCallback(data);
      }
    });
      
    this.proxy.on("webhook_subscription.deleted", (eventData:SignalrEvent) => {
      var data:Flipdish.WebhookSubscriptionDeletedEvent = JSON.parse(eventData.Body);
      if(this.WebhookSubscriptionDeletedCallback){
        if(this.log){
          console.log("webhook_subscription.deleted received");
          console.log(eventData.Body);
        }
        this.WebhookSubscriptionDeletedCallback(data);
      }
    });
      
  }
  
  public OnWebhookSubscriptionCreated(callback: WebhookSubscriptionCreatedCallback){
    if(this.log){
      console.log("webhook_subscription.created subscribed");
    }
    this.WebhookSubscriptionCreatedCallback = callback;
  }
  public OffWebhookSubscriptionCreated(callback: WebhookSubscriptionCreatedCallback){
    if(this.log){
      console.log("webhook_subscription.created unsubscribed");
    }
	this.WebhookSubscriptionCreatedCallback = undefined;
  }
  
  public OnWebhookSubscriptionUpdated(callback: WebhookSubscriptionUpdatedCallback){
    if(this.log){
      console.log("webhook_subscription.updated subscribed");
    }
    this.WebhookSubscriptionUpdatedCallback = callback;
  }
  public OffWebhookSubscriptionUpdated(callback: WebhookSubscriptionUpdatedCallback){
    if(this.log){
      console.log("webhook_subscription.updated unsubscribed");
    }
	this.WebhookSubscriptionUpdatedCallback = undefined;
  }
  
  public OnWebhookSubscriptionDeleted(callback: WebhookSubscriptionDeletedCallback){
    if(this.log){
      console.log("webhook_subscription.deleted subscribed");
    }
    this.WebhookSubscriptionDeletedCallback = callback;
  }
  public OffWebhookSubscriptionDeleted(callback: WebhookSubscriptionDeletedCallback){
    if(this.log){
      console.log("webhook_subscription.deleted unsubscribed");
    }
	this.WebhookSubscriptionDeletedCallback = undefined;
  }
  
}
/* WebhookHub End */


