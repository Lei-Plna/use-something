type Numeric = number | string;
interface DialogResizeOptions {
  minWidth?: Numeric;
  maxWidth?: Numeric;
}
export function useDialogResize(
  dialogRef: HTMLDivElement,
  options: DialogResizeOptions = {}
) {
  const { minWidth = 0, maxWidth = Infinity } = options;
  const styleTags: HTMLStyleElement[] = [];
  const resizableElements: HTMLElement[] = [];
  const events = new Map<HTMLElement, (e: MouseEvent) => void>();

  makeResizableDiv(dialogRef);

  function makeResizableDiv(element: HTMLElement) {
    const resizableDiv = document.createElement('div');
    resizableDiv.className = 'resizable';

    const resizableStyles = `
      .resizable {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .resize-handle {
        position: absolute;
        width: 100px;
        height: 100%;
        background: transparent;
        pointer-events: all;
      }

      .resize-handle.left {
        left: -5px;
        top: 0;
        cursor: ew-resize;
      }

      .resize-handle.right {
        right: -5px;
        top: 0;
        cursor: ew-resize;
      }
    `;

    const styleTag = document.createElement('style');
    styleTags.push(styleTag);

    styleTag.innerHTML = resizableStyles;
    document.head.appendChild(styleTag);

    const resizableDivArr = ['left', 'right'];

    resizableDivArr.forEach((side) => {
      const resizableIcon = document.createElement('div');
      resizableIcon.className = `resize-handle ${side}`;
      resizableDiv.appendChild(resizableIcon);
      resizableElements.push(resizableDiv);

      const onMouseDown = createMouseDownHandler(resizableIcon, element);
      events.set(resizableIcon, onMouseDown);

      resizableIcon.addEventListener('mousedown', onMouseDown);
    });

    element.appendChild(resizableDiv);
  }

  function createMouseDownHandler(
    resizableIcon: HTMLElement,
    element: HTMLElement
  ) {
    return (e: MouseEvent) => {
      e.preventDefault();

      const originalWidth = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue('width')
          .replace('px', '')
      );
      const originalX = element.getBoundingClientRect().left;
      const originalMouseX = e.pageX;

      const parentWidth = element.parentElement
        ? element.parentElement.clientWidth
        : window.innerWidth;

      const minWidthValue = parseNumeric(minWidth, parentWidth);
      const maxWidthValue = parseNumeric(maxWidth, parentWidth);

      function onMouseMove(e: MouseEvent) {
        if (resizableIcon.classList.contains('right')) {
          let width = originalWidth + e.pageX - originalMouseX;
          width = Math.max(Math.min(width, maxWidthValue), minWidthValue);
          element.style.width = `${width}px`;
        } else if (resizableIcon.classList.contains('left')) {
          let width = originalWidth + originalX - e.pageX;
          width = Math.max(Math.min(width, maxWidthValue), minWidthValue);
          element.style.width = `${width}px`;
          element.style.left = `${originalX + e.pageX - originalMouseX}px`;
        }
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  }

  function parseNumeric(value: Numeric, referenceValue: number) {
    if (typeof value === 'number') {
      return value;
    }

    const size = parseFloat(value.toString());
    if (isNaN(size)) {
      return Infinity;
    }

    if (value.endsWith('%')) {
      return (size / 100) * referenceValue;
    } else if (value.endsWith('px')) {
      return size;
    } else if (value.endsWith('vw')) {
      return (size / 100) * window.innerWidth;
    } else if (value.endsWith('vh')) {
      return (size / 100) * window.innerHeight;
    } else {
      return Infinity;
    }
  }

  const cleanup = () => {
    styleTags.forEach((tag) => tag.remove());
    resizableElements.forEach((element) => element.remove());
    events.forEach((handler, element) =>
      element.removeEventListener('mousedown', handler)
    );
    events.clear();
    resizableElements.length = 0;
  };

  return cleanup;
}
