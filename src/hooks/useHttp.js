const API_URL = "http://localhost:5000/api/messages";

export async function fetchSupportRequests({signal, routingKey}){
    const response = await fetch(`${API_URL}/support?RoutingKey=${routingKey}`, { method: "GET", signal });

    if(!response.ok) {
        throw new Error(`fetchSupportRequests failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function fetchUserMessages({signal, userId}){
    const response = await fetch(`${API_URL}/user?UserId=${userId}`, { method: "GET", signal });

    if(!response.ok) {
        throw new Error(`fetchUserMessages failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}