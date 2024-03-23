class Node {
    left = null;
    right = null;
    constructor(v) {
        this.val = v;
    }
}

class BST {
    constructor(array) {
        if (Array.isArray(array)) {
            this.root = this.buildTree(array.sort((a, b) => a > b ? 1 : -1));
        }
    }

    buildTree(array) {
        const midIdx = Math.floor(array.length / 2);
        const midElement = array[midIdx];
        const rootNode = new Node(midElement);
        const q = [[rootNode, [0, midIdx - 1]], [rootNode, [midIdx + 1, array.length]]];
        while (q.length) {
            const [node, [left, right]] = q.shift();
            const childMidIdx = Math.floor((right + left) / 2);

            if (left <= right && childMidIdx < array.length && childMidIdx >= 0) {
                const child = new Node(array[childMidIdx]);
                if (child.val <= node.val) {
                    node.left = child;
                } else {
                    node.right = child;
                }

                q.push([child, [left, childMidIdx - 1]]);
                q.push([child, [childMidIdx + 1, right]]);
            }
        }

        return rootNode;
    }

    insert(value, currNode = this.root) {
        if (!this.root || this.root.val === undefined) {
            return this.root = new Node(value);
        } else if (!currNode) {
            return new Node(value);
        }

        if (value > currNode.val) {
            currNode.right = this.insert(value, currNode.right);
            return currNode;
        } else if (value <= currNode.val) {
            currNode.left = this.insert(value, currNode.left);
            return currNode;
        }
    }

    #findHelper(curr, value) {
        if (curr === null) return null;
        else if (curr.val === value) return curr;
        else if (curr.val < value) return this.#findHelper(curr.right, value);
        else return this.#findHelper(curr.left, value);
    }

    find(value) {
        return this.#findHelper(this.root, value);
    }

    #deleteNodeHelper(node) {
        if(node === null) return;
        let canditate = this.popSuccessor(node.right, true);
        if (!canditate) {
            canditate = this.popSuccessor(node.left, false);
        }

        if (canditate) {
            node.val = canditate.val;
            if (!node.right) node.right = canditate.right;
            if (!node.left) node.left = canditate.left;
        }
        else {
            const parent = this.findParent(node);
            if (parent.left && parent.left.val === node.val) {
                parent.left = null;
            } else {
                parent.right = null;
            }
        }
    }

    deleteNode(value) {
        this.#deleteNodeHelper(this.find(value))
    }

    //Pops the left most of the node or the right most of the node
    popSuccessor(node, left) {
        const stack = [node];
        let prev = null;
        while (stack.length) {
            const curr = stack.pop();
            if (!curr) return curr;
            let next = curr.right;
            if (left) {
                next = curr.left;
            }

            if (next === null && prev) {
                if (left) {
                    prev.left = null;
                } else {
                    prev.right = null;
                }

                return curr;
            } else if (next === null) {
                const parent = this.findParent(curr);
                if (parent.left && parent.left.val === curr.val) {
                    parent.left = null;
                } else {
                    parent.right = null;
                }
                return curr;
            }

            stack.push(next);
            prev = curr;
        }

        return null;
    }

    #findParentHelper(curr, node) {
        if (curr.val > node.val) {
            if (curr.left.val === node.val) return curr;
            return this.#findParentHelper(curr.left, node);
        } else {
            if (curr.right.val === node.val) return curr;
            return this.#findParentHelper(curr.right, node);
        }
    }

    findParent(node) {
        return this.#findParentHelper(this.root, node);
    }

    levelOrder(callback) {
        const visited = [];
        const q = [this.root];
        while (q.length) {
            const curr = q.shift();

            if (callback)
                callback(curr);
            else
                visited.push(curr.val);

            if (curr.left) q.push(curr.left);
            if (curr.right) q.push(curr.right);
        }

        if (visited.length) return visited;
    }

    inOrder(callback) {
        const elements = [];
        const result = (function inOrderHelper(curr, callback) {
            if (curr === null) return;

            inOrderHelper(curr.left, callback)

            if (callback) {
                callback(curr);
            } else {
                elements.push(curr.val);
            }

            inOrderHelper(curr.right, callback)
        })(this.root, callback);

        if (elements.length) return elements;
        else return result;
    }

    preOrder(callback) {
        const elements = [];
        const result = (function inOrderHelper(curr, callback) {
            if (curr === null) return;

            if (callback) {
                callback(curr);
            } else {
                elements.push(curr.val);
            }

            inOrderHelper(curr.left, callback);
            inOrderHelper(curr.right, callback);
        })(this.root, callback);

        if (elements.length) return elements;
        else return result;
    }

    postOrder(callback) {
        const elements = [];
        const result = (function inOrderHelper(curr, callback) {
            if (curr === null) return;

            inOrderHelper(curr.left, callback);
            inOrderHelper(curr.right, callback);

            if (callback) {
                callback(curr);
            } else {
                elements.push(curr.val);
            }
        })(this.root, callback);

        if (elements.length) return elements;
        else return result;
    }

    #heightHelper(node, count) {
        if (node === null) {
            return count;
        }

        const left = this.#heightHelper(node.left, count + 1);
        const right = this.#heightHelper(node.right, count + 1);

        return Math.max(left, right);
    }

    height(node) {
        return this.#heightHelper(node, -1);
    }

    #depthHelper(node, currNode, count) {
        if(node === null) return Math.max(count, 0);
        if (node.val === currNode.val) {
            return count + 1;
        }

        if (node.val > currNode.val) {
            return this.#depthHelper(node, currNode.right, count + 1);
        } else {
            return this.#depthHelper(node, currNode.left, count + 1);
        }
    }

    depth(node) {
        return this.#depthHelper(node, this.root, -1);
    }

    isBalanced() {
        if (this.root === null) return false;

        let left = -Infinity;
        if (this.root.left) {
            left = this.height(this.root.left);
        }

        let right = -Infinity;
        if (this.root.right) {
            right = this.height(this.root.right);
        }

        return Math.max(right, 0) === Math.max(left, 0) 
              || Math.max(right, 0) === Math.max(left, 0) + 1 
              || Math.max(right, 0) + 1 === Math.max(left, 0);

    }

    rebalance(){
        if(!this.isBalanced()){
            const sorted = this.inOrder();
            this.root = this.buildTree(sorted);
        }
    }

}