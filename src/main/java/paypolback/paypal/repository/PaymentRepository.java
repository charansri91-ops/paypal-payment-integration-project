package paypolback.paypal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import paypolback.paypal.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
