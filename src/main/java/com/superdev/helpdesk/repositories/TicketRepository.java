package com.superdev.helpdesk.repositories;

import com.superdev.helpdesk.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
}
