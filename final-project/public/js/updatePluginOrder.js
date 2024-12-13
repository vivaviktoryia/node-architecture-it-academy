/* eslint-disable */
import { displayAlert } from './alert';

export async function updatePluginOrder() {
	const newOrder = [...document.querySelectorAll('.plugin-item')].map(
		(item, index) => ({
			id: +item.dataset.id,
			order: index + 1,
		}),
	);
	console.log('Plugins order:', newOrder);

	try {
		const updatePromises = newOrder.map((plugin) =>
			fetch(`/api/v1/admin/plugins/${plugin.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					order: plugin.order,
				}),
			}).then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to update plugin with ID: ${plugin.id}`);
				}
				return response.json();
			}),
		);

		await Promise.all(updatePromises);

		displayAlert('success', 'Plugins order saved successfully!');
	} catch (error) {
		console.error('Error saving plugin order:', error);
		displayAlert('error', 'Failed to save plugin order.');
	}
}
