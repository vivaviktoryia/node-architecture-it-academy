export function enableDragAndDrop() {
	const pluginList = document.querySelector('.plugin-list');
	let draggedElement = null;

	if (pluginList) {
		pluginList.addEventListener('dragstart', (e) => {
			if (e.target && e.target.matches('.plugin-item')) {
				draggedElement = e.target;
			}
		});

		pluginList.addEventListener('dragover', (e) => {
			e.preventDefault();
			const target = e.target.closest('.plugin-item');
			if (target && target !== draggedElement) {
				pluginList.insertBefore(draggedElement, target);
			}
		});

		pluginList.addEventListener('dragend', () => {
			draggedElement = null;
		});
	}
}
