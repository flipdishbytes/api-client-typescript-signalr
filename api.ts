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
      SignalR.ActiveConnection.start(this.extraHeaders, OnConnectionStarted);
      this.started = true;
      return true;
    }
    else {
      if (this.signalRConfiguration.Log) {
        console.log("Connection already started...")
      }
      return false;
    }
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
 * MenuHub
 */
export class MenuHub {
  private proxy: Proxy;
  private log: boolean;
  
  private MenuCreatedCallback: MenuCreatedCallback;
  
  private MenuUpdatedCallback: MenuUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.MenuCreatedCallback = undefined;
    
    this.MenuUpdatedCallback = undefined;
    
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
 * OrderHub
 */
export class OrderHub {
  private proxy: Proxy;
  private log: boolean;
  
  private OrderCreatedCallback: OrderCreatedCallback;
  
  private OrderRejectedCallback: OrderRejectedCallback;
  
  private OrderAcceptedCallback: OrderAcceptedCallback;
  
  private OrderRefundedCallback: OrderRefundedCallback;
  
  private OrderTipUpdatedCallback: OrderTipUpdatedCallback;
  
  private OrderRatingUpdatedCallback: OrderRatingUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.OrderCreatedCallback = undefined;
    
    this.OrderRejectedCallback = undefined;
    
    this.OrderAcceptedCallback = undefined;
    
    this.OrderRefundedCallback = undefined;
    
    this.OrderTipUpdatedCallback = undefined;
    
    this.OrderRatingUpdatedCallback = undefined;
    
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
 * StoreOpeningHoursUpdated Subscription Callback
*/
export interface StoreOpeningHoursUpdatedCallback{
  (data: Flipdish.StoreOpeningHoursUpdatedEvent): void;
}


/**
 * StoreHub
 */
export class StoreHub {
  private proxy: Proxy;
  private log: boolean;
  
  private StoreOpeningHoursUpdatedCallback: StoreOpeningHoursUpdatedCallback;
  
  public constructor(proxy: Proxy, log: boolean){
    
    this.StoreOpeningHoursUpdatedCallback = undefined;
    
    this.proxy = proxy;
    this.log = log;
    
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


