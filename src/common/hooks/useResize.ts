import React from 'react';
import { useParams } from 'react-router-dom';

interface AppSize {
	width: number;
	height: number;
}

export function useResize() {
	const [screenSize, setScreenSize] = React.useState<AppSize>(
		getCurrentDimension(),
	);
	const { invocationId } = useParams();

	function getCurrentDimension() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

	React.useEffect(() => {
		const updateDimension = () => {
			setScreenSize(getCurrentDimension());
		};
		window.addEventListener('resize', updateDimension);

		return () => {
			window.removeEventListener('resize', updateDimension);
		};
	}, [screenSize]);

	const onResizeCrossAxis = (
		containerRef: HTMLDivElement,
		resizerElementRef: HTMLDivElement,
	) => {
		const defaultHeight =
			localStorage.getItem(`terminalHeight-${invocationId}`) || '300px';
		containerRef.style.height = defaultHeight;
		const styles = window.getComputedStyle(containerRef);
		let height = parseInt(styles.height, 10);
		let y = 0;

		const onMouseMoveCrossAxis = (event: MouseEvent) => {
			const maxTerminalSize = screenSize.height - 2;
			const minTerminalSize = 100;
			const yDiff = y - event.clientY;
			y = event.clientY;
			height = height + yDiff;
			if (height > minTerminalSize && height < maxTerminalSize) {
				containerRef.style.height = `${height}px`;
			}
		};

		const onMouseUpCrossAxis = () => {
			document.removeEventListener('mousemove', onMouseMoveCrossAxis);
			localStorage.setItem(`terminalHeight-${invocationId}`, `${height}px`);
		};

		const onMouseDownCrossAxis = (event: MouseEvent) => {
			y = event.clientY;
			document.addEventListener('mousemove', onMouseMoveCrossAxis);
			document.addEventListener('mouseup', onMouseUpCrossAxis);
		};

		resizerElementRef.addEventListener('mousedown', onMouseDownCrossAxis);

		return () => {
			if (resizerElementRef)
				resizerElementRef.removeEventListener(
					'mousedown',
					onMouseDownCrossAxis,
				);
		};
	};

	return { onResizeCrossAxis };
}
