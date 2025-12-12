package paypolback.paypal.dto;

public class CreateOrderResponse {

    private String orderId;
    private String approvalLink;

    public CreateOrderResponse() {
    }

    public CreateOrderResponse(String orderId, String approvalLink) {
        this.orderId = orderId;
        this.approvalLink = approvalLink;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getApprovalLink() {
        return approvalLink;
    }

    public void setApprovalLink(String approvalLink) {
        this.approvalLink = approvalLink;
    }
}

