import jsPDF from 'jspdf';

const formats = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

/**
 * Creates a pdf of a given map, using [jsPDF](https://www.npmjs.com/package/jspdf).
 * The pdf will only contain the map image and anything that is rendered on the
 * layer canvases. Markup from e.g. controls or overlays will not be included.
 *
 * @param {Object} options
 * @param {import("ol/PluggableMap.js").default} options.map Map
 * @param {keyof formats} [options.format='a4'] PDF paper format
 * @param {number} [options.dpi=150] Target resolution of the map image in dpi
 * @returns {Promise<jsPDF>}
 */
export default function({ map, format = 'a4', dpi = 150 }) {
  return new Promise((resolve, reject) => {
    try {
      const paperSize = formats[format];
      const width = Math.round((paperSize[0] * dpi) / 25.4);
      const height = Math.round((paperSize[1] * dpi) / 25.4);
      const size = map.getSize();
      const viewResolution = map.getView().getResolution();
      map.once('rendercomplete', () => {
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = width;
        mapCanvas.height = height;
        const mapContext = mapCanvas.getContext('2d');
        Array.prototype.forEach.call(
          document.querySelectorAll('.ol-layers canvas'),
          /** @param {HTMLCanvasElement} canvas */
          (canvas) => {
            if (canvas.width > 0) {
              const opacity = /** @type {HTMLElement} */ (canvas.parentNode)
                .style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
              const transform = canvas.style.transform;
              // Get the transform parameters from the style's transform matrix
              const matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );
              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );
        const pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(
          mapCanvas.toDataURL('image/jpeg'),
          'JPEG',
          0,
          0,
          paperSize[0],
          paperSize[1]
        );
        // Reset original map size
        map.setSize(size);
        map.getView().setResolution(viewResolution);
        resolve(pdf);
      });
      const printSize = [width, height];
      map.setSize(printSize);
      const scaling = Math.min(width / size[0], height / size[1]);
      map.getView().setResolution(viewResolution / scaling);
    } catch (e) {
      reject(e);
    }
  });
}
