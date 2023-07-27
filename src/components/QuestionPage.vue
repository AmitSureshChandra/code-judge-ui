<template>
  <div class="problem-page">
    <label class="title">Problem Title:</label>
    <div class="title-text">{{ question.title }}</div>

    <label class="title">Problem Description:</label>
    <div class="description">{{  question.description }}</div>

    <label class="title">Code:</label>
    <textarea class="code" v-model="code" rows="10"></textarea>

    <label class="title">Input:</label>
    <input class="input" v-model="inputValue" type="text" />

    <label class="title">Output:</label>
    <p v-if="output && output.error">{{ output.error }}</p>
    <p else="output && output.output">{{ output }}</p>

    <div class="button-container">
      <button @click="runCode">Run Code</button>
      <button @click="clearCode">Clear Code</button>
    </div>

    <h3 class="sub-title">Examples:</h3>
    <ul class="list">
      <li v-for="example in question.examples" :key="example.id">
        <div>
          input : {{ example.input }}
        </div>
        <div>
          output : {{ example.output }}
        </div>
        <div>
          explanation : {{ example.explanation }}
        </div>
      </li>
    </ul>

    <h3 class="sub-title">Constraints:</h3>
    <ul class="list">
      <li v-for="constraint in question.constraints" :key="constraint.id">{{ constraint }}</li>
    </ul>
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
.problem-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.title-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.description {
  font-size: 14px;
  margin-bottom: 20px;
}

.code {
  width: 100%;
  height: 200px;
  padding: 10px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

.sub-title {
  font-size: 16px;
  margin-top: 20px;
}

.list {
  list-style: disc;
  margin-left: 20px;
}
</style>