module.exports = ColorPicker

/**
 * Return ColorPicker object
 * @param {array} Range - Array of hexcode as string or array
 */
function ColorPicker(Range) {
  /**
   * Return hexcode of array of integer
   * @param {string} Array - array of integer [0,255]
   * @param {bool} Prefix - return with # prefix
   */
  const ToHexCode = (array, prefix = false) => {
    let s = ''
    for (let i = 0; i < 3; i++) {
      if (array[i] > 255 || array[i] < 0) {
        throw new Error('Array was not format correctly')
      }
      s += (array[i] / 16).toString()
      s += (array[i] % 16).toString()
    }
    if (prefix) return '#' + s
    else return s
  }

  /**
   * Return array of integer of color code
   * @param {string} Hexcode
   */
  const ToArray = (s) => {
    if (s == undefined) {
      throw new Error('Hexcode is required')
    }
    let k = 0
    if (s.startsWith('#')) {
      if (s.length != 7) {
        throw new Error('Hexcode was not format correctly')
      }
      k = parseInt(s.slice(1), 16)
    } else {
      if (s.length != 6) {
        throw new Error('Hexcode was not format correctly')
      }
      k = parseInt(s, 16)
    }
    let array = []
    for (let i = 0; i < 3; i++) {
      array.push(~~(k % 256))
      k /= 256
    }
    return array.reverse()
  }

  const size = Range.length
  const Range_size = size - 1

  // Check range size
  if (size === 0 || size === 1) {
    throw new Error('Invalid Range')
  }

  let format = []
  Range.forEach((elem) => {
    if (typeof elem === 'string') {
      format.push(ToArray(elem))
    } else if (typeof elem === 'object') {
      format.push(elem)
    } else {
      throw new TypeError('Range only accept hexcode')
    }
  })

  /**
   * Return color with quried percentile
   * @param {float} precentile - percentile of the color
   * @param {bool} hexcode - wether to return as hexcode or not
   */
  const Query = (percentile, hexcode = false) => {
    const RSI = 1 / Range_size // range_size_inverse
    let acc = 0 // accumulate
    let idx = 0

    // can be optimize to O(1)
    while (acc + RSI < percentile) {
      acc += RSI
      idx++
    }

    let result_array = []

    console.log({ percentile, acc, RSI, idx })
    for (let i = 0; i < 3; i++) {
      const colorcode_float =
        format[idx][i] +
        ((percentile - acc) / RSI) * (format[idx + 1][i] - format[idx][i])
      console.log(colorcode_float)
      result_array.push(~~colorcode_float)
    }
    if (hexcode) {
      return ToHexCode(result_array)
    } else {
      return result_array
    }
  }

  return { Query }
}

export const ToColorCode = (hex) => {
  const colorString = s.split("").filter((e) => e !== "#").join("")

  if (colorString.length !== 6) {
    throw new Error('HexCode was not formatted correctly.')
  }

  return parseInt(colorString, 16)
}