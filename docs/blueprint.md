# **App Name**: WasteWise

## Core Features:

- User Authentication: Secure registration and login for citizens, collectors, and admins with predefined credentials for demo purposes (citizen/citizen123, collector/collector123, admin/admin123).
- Role-Based Map View: Display a map tailored to the user's role. Citizens see bin locations by type (paper, plastic, glass, organic). Collectors view bins and optimized routes when bins are >80% full. Admins manage all aspects of bins and users on a map.
- Citizen Reporting: Citizens can report full or broken bins, triggering notifications to collectors/admins and storing the report for tracking.
- Collector Route Optimization: Collectors view an optimized route of bins >80% full, powered by a route optimization tool, that considers factors such as distance and fill level.
- Collector Actions & Notes: Collectors mark bins as emptied, updating the bin status. They can also add notes about bin conditions for admin review and planning.
- Admin Dashboard & Notifications: Admins view statistics on collected waste, manage bins (add/remove), and manage user accounts. The system notifies admins when bins are close to full.
- Bin Fill Simulation & Notifications: Simulate bin filling based on citizen reports, increasing fill percentage, triggering notifications to admins and collectors when bins reach certain levels.

## Style Guidelines:

- Primary color: Desaturated cyan (#73A2B7) for a clean, modern feel.
- Background color: Light gray (#F0F4F5), complementing the primary and providing a neutral canvas.
- Accent color: Saturated green (#90EE90) for actionable elements and important information displays.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines, and 'Inter' (sans-serif) for body text.
- Use simple, outlined icons to represent bin types, user actions, and map markers.
- Maintain a clean, card-based layout for displaying data and actions, prioritizing clarity and ease of use.
- Implement subtle transitions for page loads, form submissions, and status updates, enhancing the user experience.