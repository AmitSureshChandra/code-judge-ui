<template>
    <div class="question-container">
        <div class="question-detail">
             <label class="title">Problem Title:</label>
            <div class="title-text">{{ question.title }}</div>

            <label class="title">Problem Description:</label>
            <div class="description">{{  question.description }}</div>
        </div>
        <div class="code-container">
            <div class="code-block">
                <input type="text" class="code-input">
            </div>
            <div class="console-">

            </div>
            <div>
                <button>Run</button>
                <button>Submit</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'QuestionPage',
    data() {
        return {
          question: {},
          output: "",
          inputValue: ""
        };
    },
    mounted() {
        this.loadQuestion()
    },  
    methods: {
        loadQuestion() {
            axios.get("/api/v1/questions/factorial")
            .then(({data}) => {
                console.log({data});
                this.question  = data
                this.code = this.question.sampleCodes.filter(i => i.compiler == 'jdk8')[0].code
            })
        },  
        runCode() {
          axios.post("/api/v1/run/questions/factorial", {
            code : this.code,
            compiler: "jdk8",
            testCases : this.convertTestCase()
          })
            .then(({data}) => {
              console.log({data});
              this.output = data
            })
        },
        convertTestCase() {
          let arr = this.inputValue.split("\n")

          let ans = []
          for (let index = 0; index < arr.length; index++) {
            ans.push(arr[index])
          }
          return ans
        },  
        clearCode() {
        this.code = "";
        this.inputValue = "";
        },
    },
};
</script>

<style>

body {
    margin: 0px;
}

div {
    border: 1px solid grey;
}

.question-container {
    display: flex;
    flex-direction: row;
    height: 100vh;
    margin: 0px;
}

.question-detail {
    width: 30%;
}

.code-container {
    display: flex;
    flex-direction: column;
    width: 70%;
}

.code-input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
}
</style>
