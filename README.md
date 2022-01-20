# x-lang

small programming language;

Steps:

1. Create parser - lexer;
   this is coming from moo which will have all identifiers and keywords
2. Create the grammer
   this is the definitions for the parse file to use to output the contents of the ast file
3. Create a parse file.
   We will feed the raw source code (someFile.x) into this and it will create the ast for us.
   this uses nearley package
