const API_URL = "http://localhost:5000/api/tickets";

export async function postMessage({ signal, body }) {
    const response = await fetch(`${API_URL}/classify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        signal
    });

    if (!response.ok) {
        let errorMessage = `postMessage failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function fetchSupportRequests({ signal, routingKey }) {
    const response = await fetch(`${API_URL}/support?RoutingKey=${routingKey}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No tickets found");
    }

    if (!response.ok) {
        let errorMessage = `fetchSupportRequests failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function fetchUserMessages({ signal, userId }) {
    const response = await fetch(`${API_URL}/user?UserId=${userId}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No tickets found");
    }

    if (!response.ok) {
        let errorMessage = `fetchUserMessages failed: ${response.status} ${response.statusText}`;
        try {
            const data = await response.json();
            const userIdError = data?.errors?.UserId?.[0];
            if (userIdError) errorMessage = "UserId required";
        } catch { }
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function fetchConversation({ signal, ticketId }) {
    const response = await fetch(`${API_URL}/conversation?TicketId=${ticketId}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No messages found");
    }

    return response.json();
}

export async function fetchTicket({ signal, ticketId }) {
    const response = await fetch(`${API_URL}?TicketId=${ticketId}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No ticket found");
    }

    return response.json();
}

export async function patchCargoTrackingNumber({ ticketId, cargoTrackingNumber, signal }) {
    if (!ticketId) throw new Error("ticketId is required");
    if (!cargoTrackingNumber?.trim()) throw new Error("CargoTrackingNumber is required");

    const response = await fetch(`${API_URL}/cargo-tracking-number?TicketId=${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CargoTrackingNumber: cargoTrackingNumber.trim() }),
        signal,
    });

    if (!response.ok) {
        let msg = `PATCH failed: ${response.status} ${response.statusText}`;
        try {
            const text = await response.text();
            if (text) msg = text;
        } catch { }
        throw new Error(msg);
    }
    return { ok: true, status: response.status };
}