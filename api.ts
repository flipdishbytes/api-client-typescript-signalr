import { Connection, hubConnection, Proxy } from "@flipdish/signalr-no-jquery";
import * as Flipdish from "@flipdish/api-client-typescript";

let defaultBasePath = "https://api.flipdish.co";

/**
* This should be created once per web app and stored somehow.
* Please don't create more than once
*/
export class SignalR {
    private activeConnection: Connection;

    public AuthorizationHub: AuthorizationHub;
    
    public CampaignHub: CampaignHub;
	
    public CustomerHub: CustomerHub;
	
    public MenuHub: MenuHub;
	
    public OrderHub: OrderHub;
	
    public PhoneCallHub: PhoneCallHub;
	
    public PrinterHub: PrinterHub;
	
    public StoreHub: StoreHub;
	
    public WebhookHub: WebhookHub;
	
    public constructor(basePath?:string, bearerToken?:string, onConnectionStarted?:() => void){
        this.activeConnection = hubConnection(basePath ? basePath : defaultBasePath);

        this.AuthorizationHub = new AuthorizationHub(this.activeConnection.createHubProxy('AuthorizationHub'));
        
        this.CampaignHub = new CampaignHub(this.activeConnection.createHubProxy("CampaignHub"));
	    
        this.CustomerHub = new CustomerHub(this.activeConnection.createHubProxy("CustomerHub"));
	    
        this.MenuHub = new MenuHub(this.activeConnection.createHubProxy("MenuHub"));
	    
        this.OrderHub = new OrderHub(this.activeConnection.createHubProxy("OrderHub"));
	    
        this.PhoneCallHub = new PhoneCallHub(this.activeConnection.createHubProxy("PhoneCallHub"));
	    
        this.PrinterHub = new PrinterHub(this.activeConnection.createHubProxy("PrinterHub"));
	    
        this.StoreHub = new StoreHub(this.activeConnection.createHubProxy("StoreHub"));
	    
        this.WebhookHub = new WebhookHub(this.activeConnection.createHubProxy("WebhookHub"));
	    
        this.activeConnection.start({extraHeaders:[{key:"Authorization", value:`Bearer ${bearerToken}`}]}, onConnectionStarted);
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

    public constructor(proxy: Proxy){
        this.proxy = proxy;
        this.proxy.on("x", () => {}); //This is so that the hub gets registered with the server
    }

    /**
     * Authenticate with the server
     * @param contractVersion version of contracts to use
     * @param done when authentication reply is received
     * @param error when an error occurs during a call
     */
    public authenticate(): Promise<any> {
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
    
    private LoyaltyCampaignCreatedCallbacks: LoyaltyCampaignCreatedCallback[];
    
    private LoyaltyCampaignDeletedCallbacks: LoyaltyCampaignDeletedCallback[];
    
    private LoyaltyCampaignUpdatedCallbacks: LoyaltyCampaignUpdatedCallback[];
    
    private RetentionCampaignCreatedCallbacks: RetentionCampaignCreatedCallback[];
    
    private RetentionCampaignDeletedCallbacks: RetentionCampaignDeletedCallback[];
    
    private RetentionCampaignUpdatedCallbacks: RetentionCampaignUpdatedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.LoyaltyCampaignCreatedCallbacks = new Array<LoyaltyCampaignCreatedCallback>();
        
        this.LoyaltyCampaignDeletedCallbacks = new Array<LoyaltyCampaignDeletedCallback>();
        
        this.LoyaltyCampaignUpdatedCallbacks = new Array<LoyaltyCampaignUpdatedCallback>();
        
        this.RetentionCampaignCreatedCallbacks = new Array<RetentionCampaignCreatedCallback>();
        
        this.RetentionCampaignDeletedCallbacks = new Array<RetentionCampaignDeletedCallback>();
        
        this.RetentionCampaignUpdatedCallbacks = new Array<RetentionCampaignUpdatedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("campaign.loyalty.created", (eventData:SignalrEvent) => {
            var data:Flipdish.LoyaltyCampaignCreatedEvent = JSON.parse(eventData.Body);
            this.LoyaltyCampaignCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("campaign.loyalty.deleted", (eventData:SignalrEvent) => {
            var data:Flipdish.LoyaltyCampaignDeletedEvent = JSON.parse(eventData.Body);
            this.LoyaltyCampaignDeletedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("campaign.loyalty.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.LoyaltyCampaignUpdatedEvent = JSON.parse(eventData.Body);
            this.LoyaltyCampaignUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("campaign.retention.created", (eventData:SignalrEvent) => {
            var data:Flipdish.RetentionCampaignCreatedEvent = JSON.parse(eventData.Body);
            this.RetentionCampaignCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("campaign.retention.deleted", (eventData:SignalrEvent) => {
            var data:Flipdish.RetentionCampaignDeletedEvent = JSON.parse(eventData.Body);
            this.RetentionCampaignDeletedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("campaign.retention.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.RetentionCampaignUpdatedEvent = JSON.parse(eventData.Body);
            this.RetentionCampaignUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnLoyaltyCampaignCreated(callback: LoyaltyCampaignCreatedCallback){
        this.LoyaltyCampaignCreatedCallbacks.push(callback);
    }
    public OffLoyaltyCampaignCreated(callback: LoyaltyCampaignCreatedCallback){
        var index:number = this.LoyaltyCampaignCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.LoyaltyCampaignCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnLoyaltyCampaignDeleted(callback: LoyaltyCampaignDeletedCallback){
        this.LoyaltyCampaignDeletedCallbacks.push(callback);
    }
    public OffLoyaltyCampaignDeleted(callback: LoyaltyCampaignDeletedCallback){
        var index:number = this.LoyaltyCampaignDeletedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.LoyaltyCampaignDeletedCallbacks.splice(index, 1);
         }
    }
    
    public OnLoyaltyCampaignUpdated(callback: LoyaltyCampaignUpdatedCallback){
        this.LoyaltyCampaignUpdatedCallbacks.push(callback);
    }
    public OffLoyaltyCampaignUpdated(callback: LoyaltyCampaignUpdatedCallback){
        var index:number = this.LoyaltyCampaignUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.LoyaltyCampaignUpdatedCallbacks.splice(index, 1);
         }
    }
    
    public OnRetentionCampaignCreated(callback: RetentionCampaignCreatedCallback){
        this.RetentionCampaignCreatedCallbacks.push(callback);
    }
    public OffRetentionCampaignCreated(callback: RetentionCampaignCreatedCallback){
        var index:number = this.RetentionCampaignCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.RetentionCampaignCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnRetentionCampaignDeleted(callback: RetentionCampaignDeletedCallback){
        this.RetentionCampaignDeletedCallbacks.push(callback);
    }
    public OffRetentionCampaignDeleted(callback: RetentionCampaignDeletedCallback){
        var index:number = this.RetentionCampaignDeletedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.RetentionCampaignDeletedCallbacks.splice(index, 1);
         }
    }
    
    public OnRetentionCampaignUpdated(callback: RetentionCampaignUpdatedCallback){
        this.RetentionCampaignUpdatedCallbacks.push(callback);
    }
    public OffRetentionCampaignUpdated(callback: RetentionCampaignUpdatedCallback){
        var index:number = this.RetentionCampaignUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.RetentionCampaignUpdatedCallbacks.splice(index, 1);
         }
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
    
    private CustomerCreatedCallbacks: CustomerCreatedCallback[];
    
    private CustomerUpdatedCallbacks: CustomerUpdatedCallback[];
    
    private CustomerConsentUpdatedCallbacks: CustomerConsentUpdatedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.CustomerCreatedCallbacks = new Array<CustomerCreatedCallback>();
        
        this.CustomerUpdatedCallbacks = new Array<CustomerUpdatedCallback>();
        
        this.CustomerConsentUpdatedCallbacks = new Array<CustomerConsentUpdatedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("customer.created", (eventData:SignalrEvent) => {
            var data:Flipdish.CustomerCreatedEvent = JSON.parse(eventData.Body);
            this.CustomerCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("customer.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.CustomerUpdatedEvent = JSON.parse(eventData.Body);
            this.CustomerUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("customer.consent.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.CustomerConsentUpdatedEvent = JSON.parse(eventData.Body);
            this.CustomerConsentUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnCustomerCreated(callback: CustomerCreatedCallback){
        this.CustomerCreatedCallbacks.push(callback);
    }
    public OffCustomerCreated(callback: CustomerCreatedCallback){
        var index:number = this.CustomerCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.CustomerCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnCustomerUpdated(callback: CustomerUpdatedCallback){
        this.CustomerUpdatedCallbacks.push(callback);
    }
    public OffCustomerUpdated(callback: CustomerUpdatedCallback){
        var index:number = this.CustomerUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.CustomerUpdatedCallbacks.splice(index, 1);
         }
    }
    
    public OnCustomerConsentUpdated(callback: CustomerConsentUpdatedCallback){
        this.CustomerConsentUpdatedCallbacks.push(callback);
    }
    public OffCustomerConsentUpdated(callback: CustomerConsentUpdatedCallback){
        var index:number = this.CustomerConsentUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.CustomerConsentUpdatedCallbacks.splice(index, 1);
         }
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
    
    private MenuCreatedCallbacks: MenuCreatedCallback[];
    
    private MenuUpdatedCallbacks: MenuUpdatedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.MenuCreatedCallbacks = new Array<MenuCreatedCallback>();
        
        this.MenuUpdatedCallbacks = new Array<MenuUpdatedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("menu.created", (eventData:SignalrEvent) => {
            var data:Flipdish.MenuCreatedEvent = JSON.parse(eventData.Body);
            this.MenuCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("menu.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.MenuUpdatedEvent = JSON.parse(eventData.Body);
            this.MenuUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnMenuCreated(callback: MenuCreatedCallback){
        this.MenuCreatedCallbacks.push(callback);
    }
    public OffMenuCreated(callback: MenuCreatedCallback){
        var index:number = this.MenuCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.MenuCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnMenuUpdated(callback: MenuUpdatedCallback){
        this.MenuUpdatedCallbacks.push(callback);
    }
    public OffMenuUpdated(callback: MenuUpdatedCallback){
        var index:number = this.MenuUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.MenuUpdatedCallbacks.splice(index, 1);
         }
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
    
    private OrderCreatedCallbacks: OrderCreatedCallback[];
    
    private OrderRejectedCallbacks: OrderRejectedCallback[];
    
    private OrderAcceptedCallbacks: OrderAcceptedCallback[];
    
    private OrderRefundedCallbacks: OrderRefundedCallback[];
    
    private OrderTipUpdatedCallbacks: OrderTipUpdatedCallback[];
    
    private OrderRatingUpdatedCallbacks: OrderRatingUpdatedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.OrderCreatedCallbacks = new Array<OrderCreatedCallback>();
        
        this.OrderRejectedCallbacks = new Array<OrderRejectedCallback>();
        
        this.OrderAcceptedCallbacks = new Array<OrderAcceptedCallback>();
        
        this.OrderRefundedCallbacks = new Array<OrderRefundedCallback>();
        
        this.OrderTipUpdatedCallbacks = new Array<OrderTipUpdatedCallback>();
        
        this.OrderRatingUpdatedCallbacks = new Array<OrderRatingUpdatedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("order.created", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderCreatedEvent = JSON.parse(eventData.Body);
            this.OrderCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("order.rejected", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderRejectedEvent = JSON.parse(eventData.Body);
            this.OrderRejectedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("order.accepted", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderAcceptedEvent = JSON.parse(eventData.Body);
            this.OrderAcceptedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("order.refunded", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderRefundedEvent = JSON.parse(eventData.Body);
            this.OrderRefundedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("order.tip.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderTipUpdatedEvent = JSON.parse(eventData.Body);
            this.OrderTipUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("order.rating.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.OrderRatingUpdatedEvent = JSON.parse(eventData.Body);
            this.OrderRatingUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnOrderCreated(callback: OrderCreatedCallback){
        this.OrderCreatedCallbacks.push(callback);
    }
    public OffOrderCreated(callback: OrderCreatedCallback){
        var index:number = this.OrderCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnOrderRejected(callback: OrderRejectedCallback){
        this.OrderRejectedCallbacks.push(callback);
    }
    public OffOrderRejected(callback: OrderRejectedCallback){
        var index:number = this.OrderRejectedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderRejectedCallbacks.splice(index, 1);
         }
    }
    
    public OnOrderAccepted(callback: OrderAcceptedCallback){
        this.OrderAcceptedCallbacks.push(callback);
    }
    public OffOrderAccepted(callback: OrderAcceptedCallback){
        var index:number = this.OrderAcceptedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderAcceptedCallbacks.splice(index, 1);
         }
    }
    
    public OnOrderRefunded(callback: OrderRefundedCallback){
        this.OrderRefundedCallbacks.push(callback);
    }
    public OffOrderRefunded(callback: OrderRefundedCallback){
        var index:number = this.OrderRefundedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderRefundedCallbacks.splice(index, 1);
         }
    }
    
    public OnOrderTipUpdated(callback: OrderTipUpdatedCallback){
        this.OrderTipUpdatedCallbacks.push(callback);
    }
    public OffOrderTipUpdated(callback: OrderTipUpdatedCallback){
        var index:number = this.OrderTipUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderTipUpdatedCallbacks.splice(index, 1);
         }
    }
    
    public OnOrderRatingUpdated(callback: OrderRatingUpdatedCallback){
        this.OrderRatingUpdatedCallbacks.push(callback);
    }
    public OffOrderRatingUpdated(callback: OrderRatingUpdatedCallback){
        var index:number = this.OrderRatingUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.OrderRatingUpdatedCallbacks.splice(index, 1);
         }
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
    
    private PhoneCallStartedCallbacks: PhoneCallStartedCallback[];
    
    private PhoneCallEndedCallbacks: PhoneCallEndedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.PhoneCallStartedCallbacks = new Array<PhoneCallStartedCallback>();
        
        this.PhoneCallEndedCallbacks = new Array<PhoneCallEndedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("phone_call.started", (eventData:SignalrEvent) => {
            var data:Flipdish.PhoneCallStartedEvent = JSON.parse(eventData.Body);
            this.PhoneCallStartedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("phone_call.ended", (eventData:SignalrEvent) => {
            var data:Flipdish.PhoneCallEndedEvent = JSON.parse(eventData.Body);
            this.PhoneCallEndedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnPhoneCallStarted(callback: PhoneCallStartedCallback){
        this.PhoneCallStartedCallbacks.push(callback);
    }
    public OffPhoneCallStarted(callback: PhoneCallStartedCallback){
        var index:number = this.PhoneCallStartedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PhoneCallStartedCallbacks.splice(index, 1);
         }
    }
    
    public OnPhoneCallEnded(callback: PhoneCallEndedCallback){
        this.PhoneCallEndedCallbacks.push(callback);
    }
    public OffPhoneCallEnded(callback: PhoneCallEndedCallback){
        var index:number = this.PhoneCallEndedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PhoneCallEndedCallbacks.splice(index, 1);
         }
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
    
    private PrinterTurnedOnCallbacks: PrinterTurnedOnCallback[];
    
    private PrinterTurnedOffCallbacks: PrinterTurnedOffCallback[];
    
    private PrinterAssignedToStoreCallbacks: PrinterAssignedToStoreCallback[];
    
    private PrinterUnassignedFromStoreCallbacks: PrinterUnassignedFromStoreCallback[];
    
    public constructor(proxy: Proxy){
        
        this.PrinterTurnedOnCallbacks = new Array<PrinterTurnedOnCallback>();
        
        this.PrinterTurnedOffCallbacks = new Array<PrinterTurnedOffCallback>();
        
        this.PrinterAssignedToStoreCallbacks = new Array<PrinterAssignedToStoreCallback>();
        
        this.PrinterUnassignedFromStoreCallbacks = new Array<PrinterUnassignedFromStoreCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("printer.turned_on", (eventData:SignalrEvent) => {
            var data:Flipdish.PrinterTurnedOnEvent = JSON.parse(eventData.Body);
            this.PrinterTurnedOnCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("printer.turned_off", (eventData:SignalrEvent) => {
            var data:Flipdish.PrinterTurnedOffEvent = JSON.parse(eventData.Body);
            this.PrinterTurnedOffCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("printer.assigned_to_store", (eventData:SignalrEvent) => {
            var data:Flipdish.PrinterAssignedToStoreEvent = JSON.parse(eventData.Body);
            this.PrinterAssignedToStoreCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("printer.unassigned_from_store", (eventData:SignalrEvent) => {
            var data:Flipdish.PrinterUnassignedFromStoreEvent = JSON.parse(eventData.Body);
            this.PrinterUnassignedFromStoreCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnPrinterTurnedOn(callback: PrinterTurnedOnCallback){
        this.PrinterTurnedOnCallbacks.push(callback);
    }
    public OffPrinterTurnedOn(callback: PrinterTurnedOnCallback){
        var index:number = this.PrinterTurnedOnCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PrinterTurnedOnCallbacks.splice(index, 1);
         }
    }
    
    public OnPrinterTurnedOff(callback: PrinterTurnedOffCallback){
        this.PrinterTurnedOffCallbacks.push(callback);
    }
    public OffPrinterTurnedOff(callback: PrinterTurnedOffCallback){
        var index:number = this.PrinterTurnedOffCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PrinterTurnedOffCallbacks.splice(index, 1);
         }
    }
    
    public OnPrinterAssignedToStore(callback: PrinterAssignedToStoreCallback){
        this.PrinterAssignedToStoreCallbacks.push(callback);
    }
    public OffPrinterAssignedToStore(callback: PrinterAssignedToStoreCallback){
        var index:number = this.PrinterAssignedToStoreCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PrinterAssignedToStoreCallbacks.splice(index, 1);
         }
    }
    
    public OnPrinterUnassignedFromStore(callback: PrinterUnassignedFromStoreCallback){
        this.PrinterUnassignedFromStoreCallbacks.push(callback);
    }
    public OffPrinterUnassignedFromStore(callback: PrinterUnassignedFromStoreCallback){
        var index:number = this.PrinterUnassignedFromStoreCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.PrinterUnassignedFromStoreCallbacks.splice(index, 1);
         }
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
    
    private StoreOpeningHoursUpdatedCallbacks: StoreOpeningHoursUpdatedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.StoreOpeningHoursUpdatedCallbacks = new Array<StoreOpeningHoursUpdatedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("store.opening_hours.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.StoreOpeningHoursUpdatedEvent = JSON.parse(eventData.Body);
            this.StoreOpeningHoursUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnStoreOpeningHoursUpdated(callback: StoreOpeningHoursUpdatedCallback){
        this.StoreOpeningHoursUpdatedCallbacks.push(callback);
    }
    public OffStoreOpeningHoursUpdated(callback: StoreOpeningHoursUpdatedCallback){
        var index:number = this.StoreOpeningHoursUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.StoreOpeningHoursUpdatedCallbacks.splice(index, 1);
         }
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
    
    private WebhookSubscriptionCreatedCallbacks: WebhookSubscriptionCreatedCallback[];
    
    private WebhookSubscriptionUpdatedCallbacks: WebhookSubscriptionUpdatedCallback[];
    
    private WebhookSubscriptionDeletedCallbacks: WebhookSubscriptionDeletedCallback[];
    
    public constructor(proxy: Proxy){
        
        this.WebhookSubscriptionCreatedCallbacks = new Array<WebhookSubscriptionCreatedCallback>();
        
        this.WebhookSubscriptionUpdatedCallbacks = new Array<WebhookSubscriptionUpdatedCallback>();
        
        this.WebhookSubscriptionDeletedCallbacks = new Array<WebhookSubscriptionDeletedCallback>();
        
        this.proxy = proxy;
        
        this.proxy.on("webhook_subscription.created", (eventData:SignalrEvent) => {
            var data:Flipdish.WebhookSubscriptionCreatedEvent = JSON.parse(eventData.Body);
            this.WebhookSubscriptionCreatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("webhook_subscription.updated", (eventData:SignalrEvent) => {
            var data:Flipdish.WebhookSubscriptionUpdatedEvent = JSON.parse(eventData.Body);
            this.WebhookSubscriptionUpdatedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
        this.proxy.on("webhook_subscription.deleted", (eventData:SignalrEvent) => {
            var data:Flipdish.WebhookSubscriptionDeletedEvent = JSON.parse(eventData.Body);
            this.WebhookSubscriptionDeletedCallbacks.forEach(callback => {
                callback(data);
            });
        });
        
    }
    
    public OnWebhookSubscriptionCreated(callback: WebhookSubscriptionCreatedCallback){
        this.WebhookSubscriptionCreatedCallbacks.push(callback);
    }
    public OffWebhookSubscriptionCreated(callback: WebhookSubscriptionCreatedCallback){
        var index:number = this.WebhookSubscriptionCreatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.WebhookSubscriptionCreatedCallbacks.splice(index, 1);
         }
    }
    
    public OnWebhookSubscriptionUpdated(callback: WebhookSubscriptionUpdatedCallback){
        this.WebhookSubscriptionUpdatedCallbacks.push(callback);
    }
    public OffWebhookSubscriptionUpdated(callback: WebhookSubscriptionUpdatedCallback){
        var index:number = this.WebhookSubscriptionUpdatedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.WebhookSubscriptionUpdatedCallbacks.splice(index, 1);
         }
    }
    
    public OnWebhookSubscriptionDeleted(callback: WebhookSubscriptionDeletedCallback){
        this.WebhookSubscriptionDeletedCallbacks.push(callback);
    }
    public OffWebhookSubscriptionDeleted(callback: WebhookSubscriptionDeletedCallback){
        var index:number = this.WebhookSubscriptionDeletedCallbacks.indexOf(callback, 0);

        if (index > -1) {
            this.WebhookSubscriptionDeletedCallbacks.splice(index, 1);
         }
    }
    
}
/* WebhookHub End */


