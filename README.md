![image](https://puu.sh/FdAqg/52a2452a97.png)

#TODO

4. Clear This/All
5. Smart Check (This/All)
    - This
        - get wordToCheck from attempts,
        - get answerToCheck from answers,
        - loop over wordToCheck.word[i] === answerToCheck[i]
            - yes, move to next cell
            - no, reset cell
    - All
6. implement local / session storage

#BUGS

1. Clear This
    - When currentWord is 0, nothing happens
    - empties cells but does not delete from attempts
