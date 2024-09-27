export type HasParent = { id: string; parentId: string | null }
export type TreeNode<T extends HasParent> = T & {
  children: Array<TreeNode<T>>
}
export type RootNode<T extends HasParent> = {
  id?: string | null
  children: Array<TreeNode<T>>
}

/**
 * Builds a tree from an array of nodes which have a parent.
 * Based on https://stackoverflow.com/a/31247960/772859, modified to preserve ordering.
 */
export function arrayToTree<T extends HasParent>(nodes: T[]): RootNode<T> {
  const topLevelNodes: Array<TreeNode<T>> = []
  const mappedArr: { [id: string]: TreeNode<T> } = {}

  // First map the nodes of the array to an object -> create a hash table.
  for (const node of nodes) {
    mappedArr[node.id] = { ...(node as any), children: [] }
  }

  for (const id of nodes.map((n) => n.id)) {
    if (mappedArr.hasOwnProperty(id)) {
      const mappedElem = mappedArr[id]
      const parentId = mappedElem.parentId
      if (!parentId) {
        continue
      }
      // If the element is not at the root level, add it to its parent array of children.
      const parentIsRoot = !mappedArr[parentId]
      if (!parentIsRoot) {
        if (mappedArr[parentId]) {
          mappedArr[parentId].children.push(mappedElem)
        } else {
          mappedArr[parentId] = { children: [mappedElem] } as any
        }
      } else {
        topLevelNodes.push(mappedElem)
      }
    }
  }
  const rootId = topLevelNodes.length ? topLevelNodes[0].parentId : undefined
  return { id: rootId, children: topLevelNodes }
}
