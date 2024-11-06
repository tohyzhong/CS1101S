// flatten_list, tree_map, count_tree, tree_sum, accumulate_tree, remove_duplicates, reverse_array
// makeup_amount, subset, permutation, count_pairs, coin_change
// memoization
// linear search, binary search, bubble, insertion, selection, merge, quicksort
// shorten_stream, scale_stream, mul_stream, add_stream, memo_fun(stream memo), stream_map_optimized
// stream_append_pickle, interweave
function flatten_list (L) { // flatten list of lists
    function helper(elem, acc) {
        if (is_null(elem)) {
            return acc;
        } else if (is_list(elem)) {
            return append(flatten_list(elem), acc);
        } else {
            return pair(elem, acc);
        }
    }
    return accumulate(helper, null, L);
}
function flatten_list_2 (L) {
    const len = length(L);
    if (is_null(L)) {
        return L;
    } else if (is_number(head(L))) {
        return pair(head(L), flatten_list_2(tail(L)));
    } else {
        return append(flatten_list_2(head(L)), flatten_list_2(tail(L)));
    }
}


function tree_map (f, tree) {
    return map(subtree => is_list(subtree) ? tree_map(f, subtree) : f(subtree), tree);
}


function count_tree(tree) {
    return accumulate((subtree, acc) => is_list(subtree) ? count_tree(subtree) + acc : 1 + acc, 0, tree);
}


function tree_sum (tree) {
    if (is_null(tree)) {
        return 0;
    } else if (is_number(head(tree))) {
        return head(tree) + tree_sum(tail(tree));
    } else {
        return tree_sum(head(tree)) + tree_sum(tail(tree));
    }
}
function tree_sum_2(tree) {
    function helper(elem, acc) {
        if (is_null(elem)) {
            return acc;
        } else if (is_number(elem)) {
            return acc + elem;
        } else {
            return tree_sum_2(elem) + acc;
        }
    }
    return accumulate(helper, 0, tree);
}






function accumulate_tree(f, op, initial, tree) {
    return accumulate(
             (elem, acc) => is_number(elem) 
                                ? op(f(elem), acc)
                                : op(accumulate_tree(f, op, initial, elem), acc),
             initial,
             tree);
}






function remove_duplicates_list(xs) {
    if (is_null(xs)) {
        return xs;
    }
    return pair(head(xs), filter(elem => elem !== head(xs), remove_duplicates_list(tail(xs))));
}
function remove_duplicates_array(xs) {
    const seen = [];
    let i = 0;
    let index = 0;
    const len = array_length(xs);
    function checker(elem) {
        const seen_len = array_length(seen);
        for (let j = 0; j < seen_len; j = j + 1) {
            if (seen[j] === elem) {
                return true;
            }
        }
        return false;
    }
    while (i < len) {
        if (checker(xs[i])) {
            i = i + 1;
        }
        else {
            seen[index] = xs[i];
            index = index + 1;
            i = i + 1;
        }
    }
    return seen;
}






function makeup_amount(x, coins) {
    if (x === 0) {
        return list(null);
    } else if (x < 0 || is_null(coins)) {
        return null;
    } else {
        // Combinations that do not use the head coin.
        const combi_A = makeup_amount(x, tail(coins));
        // Combinations that use the head coin.
        const combi_C = map(a => pair(head(coins), a), makeup_amount(x - head(coins), tail(coins)));

        return append(combi_A, combi_C);
    }
}






function reverse_array(arr) {
    function swap (A, i, j) {
        const temp = A[i];
        A[i] = A[j];
        A[j] = temp;
    }
    const len = array_length(arr);
    for (let i = 0; i < math_floor(len / 2); i = i + 1) {
        swap(arr, i, len - 1 - i);
    }
}






function first_denomination(kinds_of_coins) {
    return kinds_of_coins === 1 ?   5 :
           kinds_of_coins === 2 ?  10 :
           kinds_of_coins === 3 ?  20 :
           kinds_of_coins === 4 ?  50 :
           kinds_of_coins === 5 ? 100 : 0;
}
function coin_change(amount, kinds_of_coins) {
    return amount === 0
           ? 1
           : amount < 0 || kinds_of_coins === 0
           ? 0
           : coin_change(amount, kinds_of_coins - 1)
             +
             coin_change(amount - first_denomination(kinds_of_coins),
                kinds_of_coins);
}






function subset(xs) {
    if (is_null(xs)) {
        return list(null);
    } else {
        return append(map(sub => pair(head(xs), sub), subset(tail(xs))), subset(tail(xs)));
    }
}

function permutations(s) {
    if (is_null(s)) {
        return list(null);
    } else {
        // take every element x and consider the case where x is at the start of the permutation (in red)
        const temp = map(x => map(permutation => pair(x, permutation),
                                    permutations(remove(x, s))),
                        s);
        // temp now is a list of the “completed” wishes for every element x in s, so we just need
        // to append all the completed wishes together
        return accumulate(append, null, temp);
    }
}






function count_pairs(x) {
    let counted_pairs = null;
    function is_counted(xs) {
        return !is_null(member(xs, counted_pairs));
    }
    function traverse(p) {
        if (!is_pair(p) || is_counted(p)) {
            return 0;
        } else {
        // add p to counted_pairs
            counted_pairs = pair(p, counted_pairs);
            return 1 + traverse(head(p)) + traverse(tail(p));
        }
    }
    return traverse(x);
}





// MEMOIZATION
const mem = [];
function read(n, k) {
    return mem[n] === undefined
           ? undefined
           : mem[n][k];
}
function write(n, k, value) {
    if (mem[n] === undefined) {
        mem[n] = [];
    }
    mem[n][k] = value;
}






// Linear search
function linear_search_list(xs, x) {
    let index = 1;
    while (!is_null(xs)) {
        if (head(xs) === x) {
            return index;
        } else {
            index = index + 1;
            xs = tail(xs);
        }
    }
    return false;
}

function linear_search_array(A, x) {
    let index = 0;
    const len = array_length(A);
    while (index < len) {
        if (A[index] === x) {
            return index;
        } else {
            index = index + 1;
        }
    }
    return false;
}

// Binary search
function binary_search(A, x) {
    function helper(low, high) {
        const mid = math_floor((low + high) / 2);
        if (low > high) {
           return false; 
        } else if (A[mid] === x) {
            return mid;
        } else if (A[mid] > x) {
            return helper(low, mid - 1);
        } else {
            return helper(mid + 1, high);
        }
    }
    return helper(0, array_length(A) - 1);
}

// Bubblesort
function bubblesort_lst(xs) { // destructive
    const len = length(xs);
    let swapped = false;
    for (let i = len - 1; i >= 1; i = i - 1) {
        let ptr = xs;
        swapped = false;
        for (let j = 0; j < i; j = j + 1) {
            if (head(ptr) > head(tail(ptr))) {
                const temp = head(ptr);
                set_head(ptr, head(tail(ptr)));
                ptr = tail(ptr);
                set_head(ptr, temp);
                swapped = true;
            } else {
                ptr = tail(ptr);
            }
        }
        if (!swapped) {
            break;
        }
    }
}

function bubblesort_arr(A) { // destructive
    let swapped = false;
    for (let i = array_length(A) - 1;i >= 1; i = i - 1) {
        swapped = false;
        for (let j = 0; j < i; j = j + 1) {
            if (A[j] > A[j + 1]) {
                const temp = A[j];
                A[j] = A[j + 1];
                A[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}

// Selection sort
function selection_sort_lst(xs) { // constructive
    function smallest(xs) {
        return accumulate((x, y) => x < y ? x : y, 
                          head(xs), tail(xs));
    }
    if (is_null(xs)) {
        return xs;
    } else {
        const x = smallest(xs);
        return pair(x, selection_sort_lst(remove(x, xs)));
    }
}
function selection_sort_lst_destructive(xs) { // destructive
    let start = xs;
    while (!is_null(start)) {
        let smallest = start;
        let ptr = tail(start);
        while (!is_null(ptr)) {
            if (head(ptr) < head(smallest)) {
                smallest = ptr;
            }
            ptr = tail(ptr);
        }
        const temp = head(smallest);
        set_head(smallest, head(start));
        set_head(start, temp);
        start = tail(start);
    }
    return xs;
}

function selection_sort_arr(A) { // destructive
    const len = array_length(A);
    function smallest(start) {
        let acc = pair(A[start], start);
        for (let index = start + 1; index < len; index = index + 1) {
            if (A[index] < head(acc)) {
                set_head(acc, A[index]);
                set_tail(acc, index);
            }
        }
        return acc;
    }
    for (let i = 0; i < len; i = i + 1) {
        const temp = A[i];
        const smallpair = smallest(i);
        A[i] = head(smallpair);
        A[tail(smallpair)] = temp;
    }
}

// Insertion sort list
function insertion_sort_lst(xs) { // constructive
    function insert_lst(x, xs) {
        return is_null(xs)
               ? list(x)
               : x <= head(xs)
               ? pair(x, xs)
               : pair(head(xs), insert_lst(x, tail(xs)));
    }
    return is_null(xs) 
           ? xs
           : insert_lst(head(xs), insertion_sort_lst(tail(xs)));
}
function insertion_sort_lst_destructive(xs) { // destructive, assign list to the result of this again
    function insert_lst(xs, sorted) {
        if (is_null(sorted) || head(xs) < head(sorted)) {
            set_tail(xs, sorted);
            sorted = xs;
        } else {
            let ptr = sorted;
            let prev = null;
            while (!is_null(ptr) && head(xs) >= head(ptr)) {
                prev = ptr;
                ptr = tail(ptr);
            }
            set_tail(xs, ptr);
            if (prev !== null) {
                set_tail(prev, xs);
            }
        }
        return sorted;
    }
    let sorted = null;
    let ptr = xs;
    while (!is_null(ptr)) {
        let next = tail(ptr);
        sorted = insert_lst(ptr, sorted);
        ptr = next;
    }
    return sorted;
}

// Insertion sort array
function insertion_sort_arr(A) { // destructive
    const len = array_length(A);
    for (let i = 1; i < len; i = i + 1) {
        const insertor = A[i];
        let j = i - 1;
        while (j >= 0 && insertor < A[j]) {
            A[j + 1] = A[j];
            j = j - 1;
        }
        A[j + 1] = insertor;
    }
}

// Mergesort Lists Destructive
function d_split_list(xs) {
    const mid = math_ceil(length(xs) / 2);
    let ptr = xs;
    let i = 1;
    while (i < mid) {
        i = i + 1;
        ptr = tail(ptr);
    }
    const temp = tail(ptr);
    set_tail(ptr, null);
    return pair(xs, temp);
}
function d_merge(xs, ys) {
    if (is_null(xs)) {
        return ys;
    } else if (is_null(ys)) {
        return xs;
    } else if (head(xs) < head(ys)) {
        set_tail(xs, d_merge(tail(xs), ys));
        return xs;
    } else {
        set_tail(ys, d_merge(xs, tail(ys)));
        return ys;
    }
}
function d_merge_sort(xs) {
    if (is_null(xs) || is_null(tail(xs))) {
        return xs;
    } else {
        const new_lists = d_split_list(xs);
        return d_merge(d_merge_sort(head(new_lists)), d_merge_sort(tail(new_lists)));
    }
}

// Mergesort Lists Constructive
function middle(n) {
    return math_floor(n / 2);
}
function take(xs, n) {
    if (n === 0) {
        return null;
    } else {
        return pair(head(xs), take(tail(xs), n - 1));
    }
}
function drop(xs, n) {
    if (n === 0) {
        return xs;
    } else {
        return drop(tail(xs), n - 1);
    }
}
function merge(xs, ys) {
    if (is_null(xs)) {
        return ys;
    } else if (is_null(ys)) {
        return xs;
    } else {
        const x = head(xs);
        const y = head(ys);
        return x < y
               ? pair(x, merge(tail(xs), ys))
               : pair(y, merge(xs, tail(ys)));
    }
}
function merge_sort(xs) {
    if (is_null(xs) || is_null(tail(xs))) {
        return xs;
    } else {
        const mid = middle(length(xs));
        return merge(merge_sort(take(xs, mid)),
                     merge_sort(drop(xs, mid)));
    }
}

// Mergesort Array Destructive
function merge_sort_arr(A) {
    merge_sort_helper_arr(A, 0, array_length(A) - 1);
}
function merge_sort_helper_arr(A, low, high) {
    if (low < high) {
        const mid = math_floor((low + high) / 2);
        merge_sort_helper_arr(A, low, mid);
        merge_sort_helper_arr(A, mid + 1, high);
        merge_arr(A, low, mid, high);
    }
}
function merge_arr(A, low, mid, high) {
    const B = [];
    let i = low;
    let j = mid + 1;
    let k = 0;
    while (i <= mid || j <= high) {
        if (i > mid) {
            B[k] = A[j];
            j = j + 1;
        } else if (j > high) {
            B[k] = A[i];
            i = i + 1;
        } else if (A[i] < A[j]) {
            B[k] = A[i];
            i = i + 1;
        } else {
            B[k] = A[j];
            j = j + 1;
        }
        k = k + 1;
    }
    // Copy back the merged parts to A
    for (let n = 0; n < k; n = n + 1) {
        A[low + n] = B[n];
    }
}

// Quicksort lists constructive
function partition(xs, p) {
    const part_a = filter(x => x <= p, xs);
    const part_b = filter(x => x > p, xs);
    return pair(part_a, part_b);
}

function quicksort(xs) {
    if (is_null(xs)) {
        return null;
    } else{
        const pivot = head(xs);
        const split_list = partition(tail(xs), pivot);
        return append(quicksort(head(split_list)), pair(pivot, quicksort(tail(split_list))));
    }
}

// Quicksort array destructive
function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
function partition_arr(A, low, high) {
    const pivot = A[high];
    let i = low;
    for (let j = low; j <= high - 1; j = j + 1) {
        if (A[j] < pivot) {
            swap(A, i, j);
            i = i + 1;
        }
    }
    swap(A, i, high);
    return i;
}
function quicksort_arr(A, low, high) {
    if (low < high) {
        const pivot_index = partition_arr(A, low, high);
        quicksort_arr(A, low, pivot_index - 1);
        quicksort_arr(A, pivot_index + 1, high);
    }
}


// STREAMS
function shorten_stream(s, k) {
    function helper(s, i) {
        if (i === k || is_null(stream_tail(s))) {
            return pair(head(s), () => null);
        } else {
            return pair(head(s), () => helper(stream_tail(s), i + 1));
        }
    }
    return helper(s, 1);
}

function add_streams(s1, s2) {
    return is_null(s1)
        ? s2
        : is_null(s2)
        ? s1
        : pair(head(s1) + head(s2),
               () => add_streams(stream_tail(s1), 
                                 stream_tail(s2)));
}

function mul_streams(s1, s2) {
    return is_null(s1)
        ? s2
        : is_null(s2)
        ? s1
        : pair(head(s1) * head(s2),
               () => mul_streams(stream_tail(s1), 
                                 stream_tail(s2)));
}

function scale_stream(c, stream) {
    return stream_map(x => c * x, stream);
}

function memo_fun(fun) { //memoized stream
    let already_run = false;
    let result = undefined;

    function mfun() {
        if (!already_run) {
            result = fun();
            already_run = true;
            return result;
        } else {
            return result;
        }
    }
    return mfun;
}
function stream_map_optimized(f, s) {
    return is_null(s)
           ? null
           : pair(f(head(s)),
                  memo_fun( () => stream_map_optimized(
                                      f, stream_tail(s)) ));
}

function stream_append_pickle(xs, ys) {
    return is_null(xs)
        ? ys()
        : pair(head(xs),
            () => stream_append_pickle(stream_tail(xs),
            ys));
}

function interweave(s1, s2) {
	return is_null(s1) ? s2 : pair(head(s1), () => interweave(s2, stream_tail(s1)));
}
