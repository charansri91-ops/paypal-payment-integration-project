package paypolback.paypal.controller;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import paypolback.paypal.entity.Payment;
import paypolback.paypal.repository.PaymentRepository;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {
	@Autowired
	private PaymentRepository paymentRepository;

	@PostMapping("/create-order")
	public ResponseEntity<Map<String, String>> createOrder(
	        @RequestBody Map<String, Object> body
	) {
	    // 1️⃣ Read amount & currency from JSON
	    Object amountObj = body.get("amount");
	    Object currencyObj = body.get("currency");

	    if (amountObj == null || currencyObj == null) {
	        // If frontend/postman doesn't send them properly
	        return ResponseEntity.badRequest().build();
	    }

	    String amount = amountObj.toString();
	    String currency = currencyObj.toString();

	    // 2️⃣ Generate fake order ID
	    String fakeOrderId = UUID.randomUUID().toString();

	    // 3️⃣ Save in DB using your existing Payment entity
	    Payment payment = new Payment();
	    payment.setOrderId(fakeOrderId);   // adjust if your field name is different
	    payment.setAmount(amount);         // adjust setter name to your entity
	    payment.setCurrency(currency);     // adjust setter name if needed
	    payment.setStatus("CREATED");      // adjust if you use different field

	    paymentRepository.save(payment);

	    // 4️⃣ Send response for mobile app / Postman
	    Map<String, String> response = new HashMap<>();
	    response.put("orderId", fakeOrderId);
	    response.put("approvalLink",
	            "https://www.sandbox.paypal.com/checkoutnow?token=" + fakeOrderId);

	    return ResponseEntity.ok(response);
	}


	
	@PostMapping("/capture-order/{orderId}")
	public ResponseEntity<Map<String, String>> captureOrder(@PathVariable String orderId) {

	    Payment payment = new Payment();
	    payment.setOrderId(orderId);
	    payment.setAmount("10.00");
	    payment.setCurrency("USD");
	    payment.setStatus("CAPTURED");

	    paymentRepository.save(payment);

	    Map<String, String> body = new HashMap<>();
	    body.put("message", "Dummy capture success");
	    body.put("id", orderId);

	    return ResponseEntity.ok(body);
	}


    // extra GET to test quickly in browser
    @GetMapping("/ping")
    public String ping() {
        return "paypal backend is up";
    }
}
