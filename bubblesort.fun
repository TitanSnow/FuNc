~bubblesort = func@[A;][
	local n
	n = len A
	for range n func@[i;][
		for range@[n-1] func@[j;][
			if@[A.j> @[A. @[j+1]]][
				local t
				t = @[A.j]
				A.=j @[A. @[j+1]]
				A.= @[j+1] t
			][ ]
		]
	]
]
~rand = [ eval'Math.random()' ]
~randint = [ rand*32767//1 ]
~maxn = 10
~randseq = [
	local rst
	rst = ;;
	for range maxn func@[i;][
		rst.push _ randint
	]
	rst
]
~main = [
	local arr
	arr = randseq
	print arr
	bubblesort arr
	print arr
]
main
