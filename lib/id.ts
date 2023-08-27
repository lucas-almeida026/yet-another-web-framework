function* IdMaker() {
  let id = 1
  while (true) {
    yield id++
  }
}
export const idMaker = IdMaker()