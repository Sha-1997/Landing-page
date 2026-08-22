const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000/api/v1"
        : "https://ecosystem.jovianex.com/api/v1";

        
async function getMemberCount() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/count`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    return 780;
  } catch (error) {
    console.error("Error fetching count:", error);
    return 780;
  }
}

async function getFounderSeatStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/founder/seats`);
    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return {
      claimed: 842,
      total: 1000,
      remaining: 158,
      percentage: 84.2
    };
  } catch (error) {
    console.error("Error fetching founder seat stats:", error);

    return {
      claimed: 842,
      total: 1000,
      remaining: 158,
      percentage: 84.2
    };
  }
}


/* =========================================
   MEMBERSHIP PLANS
   ========================================= */

async function getMembershipPlans() {
  try {
    const response = await fetch(`${API_BASE_URL}/membership/plans`);

    if (!response.ok) {
      throw new Error(
        `Membership plans request failed: ${response.status}`
      );
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }

    console.error("Invalid membership plans response:", result);

    return [];

  } catch (error) {
    console.error("Error fetching membership plans:", error);
    return [];
  }
}