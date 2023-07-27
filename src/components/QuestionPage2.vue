<template>
    <v-app >
        <v-row class="ma-1" style="height: 95vh; width: 100%">
                <v-card width="30%">
                    <v-card-title>
                        <h4>
                            {{ question.id }} . {{question.title}}
                        </h4>
                    </v-card-title>
                    <v-card-text>
                        <div class="my-2">
                            <p>{{question.description}}</p>
                        </div>
                        <v-divider />
                        <div>
                            <b>Examples</b> 
                            <v-card class="ma-1" v-for="(example, index) in question.examples" :key="index">
                                <v-card-text>
                                    <p>input : {{example.input }}</p>
                                    <p>output : {{example.output }}</p>
                                    <p>explanation : {{example.explanation }}</p>
                                </v-card-text>
                            </v-card>
                        </div>
                        <div>
                            <b>Contraints</b> 
                            <v-card class="ma-1" v-for="(contraint, index) in question.constraints" :key="index">
                                <v-card-text>
                                   <p>{{ contraint }}</p>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-card-text>
                </v-card>
                <v-card width="70%" class="pa-2">
                   <v-col class="mb-2">
                    <v-row>
                        <v-select v-model="compiler" density="compact" max-width="200" label="compiler" :items="['jdk8','golang']" variant="solo" />
                        <v-spacer />
                        <v-spacer />
                        <v-spacer />
                        <v-spacer />
                    </v-row>
                     <v-row>
                        <v-textarea v-model="code" auto-grow rows="10">
                        </v-textarea>
                    </v-row>
                   
                    <v-spacer/>
                    <v-row >
                        <v-card class="" width="100%">
                            <v-tabs
                            dark
                            v-model="code_tab"
                            
                            >
                            <v-tab value="test_cases">Test Cases</v-tab>
                            <v-tab value="result">Result</v-tab>
                            </v-tabs>

                            <v-card-text>
                            <v-window v-model="code_tab">
                                <v-window-item value="test_cases">
                                    <v-tabs
                                    dark
                                    v-model="testcase_tab"
                                    
                                    >
                                        <v-tab v-for="(test_case, i) in question.testCases" :key="i" :value="i">Test Case {{ i+1 }}</v-tab>
                                    </v-tabs>
                                     <v-window v-model="testcase_tab">
                                         <v-window-item v-for="(test_case, i) in question.testCases" :key="i" :value="i">
                                            <v-col>
                                                <h4 class="ml-3 display-4">n = </h4>
                                                <v-text-field v-model="inputs[i]"/>
                                            </v-col>
                                         </v-window-item>
                                    </v-window>
                                    
                                </v-window-item>

                                <v-window-item value="result">
                                <p class="text-red" v-if="error != '' ">{{ error }}</p>
                                <div v-else>
                                     <v-tabs
                                        dark
                                        v-model="output_tab"
                                    >
                                        <v-tab v-for="(test_case, i) in output" :key="i" :value="i" ><span :style="'color:' + (test_case.status ? '#00ff00' : '#ff0000')">Test Case {{ i+1 }}</span></v-tab>
                                        </v-tabs>
                                        <v-window v-model="output_tab">
                                            <v-window-item v-for="(test_case, i) in output" :key="i" :value="i">
                                                <v-col>
                                                     <!-- { "testCase": "0", "answer": "0", "expectedAns": "1", "status": false } -->
                                                    <p>n = {{ test_case.testCase }}</p>
                                                    <p>output : {{ test_case.answer }}</p>
                                                    <p>expected : {{ test_case.expectedAns }}</p>
                                                </v-col>
                                            </v-window-item>
                                        </v-window>
                                </div>
                                </v-window-item>
                            </v-window>
                            </v-card-text>
                        </v-card>
                    </v-row>

                    <v-row>
                        <v-row class="px-3 mt-4">
                            <v-btn :disabled="loading" @click="runCode" variant="tonal">
                                Run
                            </v-btn>
                            <v-spacer />
                             <v-btn :disabled="loading" @click="submit" variant="tonal">
                                Submit
                            </v-btn>
                        </v-row>
                    </v-row>
                   </v-col>


                </v-card>
        </v-row>
    </v-app>
</template>
<script>
import axios from 'axios';

export default {
    name: 'QuestionPage',
    data() {
        return {
          question: {},
          output: "",
          inputValue: "",
          code_tab: 0,
          compiler: "jdk8",
          code: "",
          testcase_tab: 0,
          inputs: [],
          error: "",
          output_tab: 0,
          loading: false
        };
    },
    mounted() {
        this.loadQuestion()
    },  
    methods: {
        loadQuestion() {
            this.loading = true
            axios.get("/api/v1/questions/factorial")
            .then(({data}) => {
                this.loading = false
                console.log({data});
                this.question  = data
                this.inputs = this.question.testCases.map(i => i.input)
                this.code = this.question.sampleCodes.filter(i => i.compiler == 'jdk8')[0].code
            })
        },  
        runCode() {
            this.loading = true
            this.error = ""
          axios.post("/api/v1/run/questions/factorial", {
            code : this.code,
            compiler: "jdk8",
            testCases : this.inputs
          })
            .then(({data}) => {
              this.code_tab = 1
              console.log({data});
              this.loading = false
              if(data.error) {
                this.error = data.error
              }
              else 
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
}
</style>
