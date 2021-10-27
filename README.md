# parts-to-ldr-mlcad
 
Script to transform a list (CSV file) of parts into a ldr file containing all the parts.

## Input

As a input, use a `.csv` file with this exact format:

```csv
partno,color,quantity
11090,0,1
23443,0,1
36840,0,2
99780,0,1
99207,0,8
```

## Output

It will produce a `.ldr` file with this structure:

```
0
0 Name: yop.ldr
0 Author: me
1 0 50 50 50 1 0 0 0 1 0 0 0 1 11090.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 23443.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 36840.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 36840.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99780.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
1 0 50 50 50 1 0 0 0 1 0 0 0 1 99207.dat
```

This file complies with the [LDraw File Format Specification](https://www.ldraw.org/article/218.html).