const API_URL = "http://localhost:5000/api/messages";

export async function fetchSupportRequests({signal, routingKey}){
    const response = await fetch(`${API_URL}/support?RoutingKey=${routingKey}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No messages found");
    }

    if(!response.ok) {
        let errorMessage = `fetchSupportRequests failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
    }

    return response.json();
}

export async function fetchUserMessages({signal, userId}){
    const response = await fetch(`${API_URL}/user?UserId=${userId}`, { method: "GET", signal });

    if (response.status === 204) {
        throw new Error("No messages found");
    }

    if(!response.ok) {
        let errorMessage = `fetchUserMessages failed: ${response.status} ${response.statusText}`;
        try {
            const data = await response.json();
            const userIdError = data?.errors?.UserId?.[0];
            if (userIdError) errorMessage = "UserId required";
        } catch {}
        throw new Error(errorMessage);
    }

    return response.json();
}